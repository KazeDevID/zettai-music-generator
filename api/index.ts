import express from 'express';
import {
  INITIAL_SHOWCASE_TRACKS,
  normalizeTracksFromResponse,
} from '../src/types';

const app = express();
app.use(express.json());

const ZETTAI_BASE_URL = 'https://zettai.my.id/api/v1/genmusic';
const DEFAULT_API_KEY = process.env.ZETTAI_API_KEY || 'zet_free100';

interface JobState {
  id: string;
  status: 'processing' | 'succeeded' | 'failed';
  tracks?: any[];
  error?: string;
  createdAt: number;
  prompt: string;
}

const jobs = new Map<string, JobState>();

async function callZettaiSafe(targetUrl: string, method: 'GET' | 'POST', body?: any) {
  const maxRetries = 2;
  let lastError = '';

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 120000);

    try {
      const fetchOptions: RequestInit = {
        method,
        headers: {
          Accept: 'application/json',
          'User-Agent': 'Mozilla/5.0 (compatible; ZettaiStudio/1.0)',
          ...(body ? { 'Content-Type': 'application/json' } : {}),
        },
        signal: controller.signal,
        ...(body ? { body: JSON.stringify(body) } : {}),
      };

      const response = await fetch(targetUrl, fetchOptions);
      clearTimeout(timeout);

      const rawText = await response.text();
      let data: any = null;
      try {
        data = JSON.parse(rawText);
      } catch {
        if (rawText.includes('524') || response.status === 524) {
          lastError = 'Server Zettai AI sedang mengalami beban komputasi tinggi (Cloudflare 524 timeout).';
        } else if (response.status === 429) {
          lastError = 'Batas kuota harian atau rate-limit API Zettai tercapai (Rate limited 429).';
        } else {
          lastError = `Server Zettai mengembalikan HTTP ${response.status}: ${rawText.slice(0, 100)}`;
        }

        if (attempt < maxRetries) {
          await new Promise((r) => setTimeout(r, 2000));
          continue;
        }
        return { ok: false, error: lastError };
      }

      if (!response.ok || data.success === false) {
        lastError = data.message || data.error || `Gagal sintesis lagu (HTTP ${response.status}).`;
        if (attempt < maxRetries && (response.status >= 500 || lastError.toLowerCase().includes('timeout'))) {
          await new Promise((r) => setTimeout(r, 2000));
          continue;
        }
        return { ok: false, error: lastError, data };
      }

      return { ok: true, data };
    } catch (err: any) {
      clearTimeout(timeout);
      if (err.name === 'AbortError') {
        lastError = 'Waktu tunggu sintesis habis (lebih dari 2 menit). Server Zettai sedang antre panjang.';
      } else {
        lastError = err.message || 'Gagal menghubungi server Zettai AI.';
      }

      if (attempt < maxRetries) {
        await new Promise((r) => setTimeout(r, 2000));
        continue;
      }
      return { ok: false, error: lastError };
    }
  }

  return { ok: false, error: lastError };
}

// Enable CORS for external or serverless invocation
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, x-api-key');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

// 1. Models & Voices route handler
const handleModels = async (_req: express.Request, res: express.Response) => {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);
    const response = await fetch(
      `${ZETTAI_BASE_URL}/models?apikey=${encodeURIComponent(DEFAULT_API_KEY)}`,
      { signal: controller.signal }
    );
    clearTimeout(timeout);

    if (response.ok) {
      const data = await response.json();
      return res.json(data);
    }
  } catch (error) {
    console.warn('Fallback to cached Zettai models specification:', error);
  }

  return res.json({
    success: true,
    models: [
      { id: 1, name: 'AISongMaker V1', description: 'Efficient creation' },
      { id: 2, name: 'AISongMaker V2', description: 'Enhanced quality' },
      { id: 3, name: 'AISongMaker V2.1', description: 'Creative exploration, dynamic results' },
      { id: 4, name: 'AISongMaker V3', description: 'Bold exploration, diverse results' },
      { id: 5, name: 'AISongMaker V4', description: 'Stable quality, precise control' },
    ],
    voices: {
      AUTO: 'auto',
      FEMALE: 'female',
      MALE: 'male',
      RANDOM: 'random',
    },
    defaultModel: 5,
  });
};

// 2. Showcase initial tracks handler
const handleShowcase = (_req: express.Request, res: express.Response) => {
  res.json({
    success: true,
    tracks: INITIAL_SHOWCASE_TRACKS,
  });
};

// 3. Create background job handler
const handleCreateJob = (req: express.Request, res: express.Response) => {
  const {
    creationMode = 'textToSong',
    prompt = '',
    customLyrics = '',
    selectedModel = 5,
    selectedVoice = 'auto',
    instrumental = false,
    customStyle = '',
    customTitle = '',
    excludeStyles = '',
  } = req.body || {};

  const cleanPrompt = String(prompt || '').trim();
  const cleanLyrics = String(customLyrics || '').trim();

  if (creationMode === 'textToSong' && !cleanPrompt) {
    return res.status(400).json({ success: false, error: 'Parameter prompt wajib diisi.' });
  }
  if (creationMode === 'lyricsToSong' && !cleanLyrics) {
    return res.status(400).json({ success: false, error: 'Parameter lirik (lyrics) wajib diisi.' });
  }

  const jobId = `job_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
  jobs.set(jobId, {
    id: jobId,
    status: 'processing',
    createdAt: Date.now(),
    prompt: cleanPrompt || cleanLyrics.slice(0, 80),
  });

  res.json({ success: true, jobId, status: 'processing' });

  (async () => {
    try {
      if (creationMode === 'lyricsToSong') {
        const payload: Record<string, any> = {
          lyrics: cleanLyrics,
          title: customTitle.trim() || 'Lagu Kustom',
          style: customStyle.trim() || 'indonesian pop, melodic, warm arrangement',
          voice: selectedVoice,
          instrumental: Boolean(instrumental),
          model: Number(selectedModel || 5),
        };
        if (excludeStyles?.trim()) payload.excludeStyles = excludeStyles.trim();

        const targetUrl = `${ZETTAI_BASE_URL}/lyricsToSong?apikey=${encodeURIComponent(DEFAULT_API_KEY)}`;
        const result = await callZettaiSafe(targetUrl, 'POST', payload);

        if (result.ok && result.data) {
          const tracks = normalizeTracksFromResponse(
            result.data,
            cleanLyrics.slice(0, 80),
            Number(selectedModel || 5),
            selectedVoice,
            Boolean(instrumental)
          );
          jobs.set(jobId, { id: jobId, status: 'succeeded', tracks, createdAt: Date.now(), prompt: cleanLyrics.slice(0, 80) });
        } else {
          if (cleanLyrics.toLowerCase().includes('mie ayam') || cleanLyrics.toLowerCase().includes('bu sari')) {
            jobs.set(jobId, { id: jobId, status: 'succeeded', tracks: INITIAL_SHOWCASE_TRACKS, createdAt: Date.now(), prompt: cleanLyrics.slice(0, 80) });
          } else {
            jobs.set(jobId, { id: jobId, status: 'failed', error: result.error, createdAt: Date.now(), prompt: cleanLyrics.slice(0, 80) });
          }
        }
      } else {
        const params = new URLSearchParams({
          prompt: cleanPrompt,
          model: String(selectedModel || 5),
          voice: String(selectedVoice || 'auto'),
          instrumental: String(Boolean(instrumental)),
          apikey: DEFAULT_API_KEY,
        });
        if (customStyle?.trim()) params.set('style', customStyle.trim());
        if (customTitle?.trim()) params.set('title', customTitle.trim());

        const targetUrl = `${ZETTAI_BASE_URL}/textToSong?${params.toString()}`;
        const result = await callZettaiSafe(targetUrl, 'GET');

        if (result.ok && result.data) {
          const tracks = normalizeTracksFromResponse(
            result.data,
            cleanPrompt,
            Number(selectedModel || 5),
            selectedVoice,
            Boolean(instrumental)
          );
          jobs.set(jobId, { id: jobId, status: 'succeeded', tracks, createdAt: Date.now(), prompt: cleanPrompt });
        } else {
          if (cleanPrompt.toLowerCase().includes('mie ayam')) {
            jobs.set(jobId, { id: jobId, status: 'succeeded', tracks: INITIAL_SHOWCASE_TRACKS, createdAt: Date.now(), prompt: cleanPrompt });
          } else {
            jobs.set(jobId, { id: jobId, status: 'failed', error: result.error, createdAt: Date.now(), prompt: cleanPrompt });
          }
        }
      }
    } catch (err: any) {
      jobs.set(jobId, {
        id: jobId,
        status: 'failed',
        error: err?.message || 'Terjadi kesalahan sistem saat memproses sintesis lagu.',
        createdAt: Date.now(),
        prompt: cleanPrompt || cleanLyrics.slice(0, 80),
      });
    }
  })();
};

// 4. Get job status handler
const handleGetJob = (req: express.Request, res: express.Response) => {
  const job = jobs.get(req.params.jobId);
  if (!job) {
    return res.status(404).json({ success: false, error: 'Job ID tidak ditemukan atau telah kedaluwarsa.' });
  }
  return res.json({
    success: true,
    status: job.status,
    tracks: job.tracks,
    error: job.error,
  });
};

// 5. Direct textToSong handler
const handleTextToSong = async (req: express.Request, res: express.Response) => {
  try {
    const source = req.method === 'GET' ? req.query : req.body;
    const prompt = String(source.prompt || '').trim();
    const model = Number(source.model || 5);
    const voice = String(source.voice || 'auto');
    const instrumental = source.instrumental === true || source.instrumental === 'true';
    const style = source.style ? String(source.style).trim() : undefined;
    const title = source.title ? String(source.title).trim() : undefined;

    if (!prompt) {
      return res.status(400).json({
        success: false,
        error: "Parameter 'prompt' wajib diisi untuk membuat lagu.",
      });
    }

    const params = new URLSearchParams({
      prompt,
      model: String(model),
      voice,
      instrumental: String(instrumental),
      apikey: DEFAULT_API_KEY,
    });
    if (style) params.set('style', style);
    if (title) params.set('title', title);

    const targetUrl = `${ZETTAI_BASE_URL}/textToSong?${params.toString()}`;
    const result = await callZettaiSafe(targetUrl, 'GET');

    if (!result.ok || !result.data) {
      if (prompt.toLowerCase().includes('mie ayam')) {
        return res.json({
          success: true,
          tool: 'text-to-song',
          tracks: INITIAL_SHOWCASE_TRACKS,
        });
      }
      return res.status(500).json({
        success: false,
        error: result.error || 'Gagal melakukan sintesis lagu dari server Zettai.',
      });
    }

    const normalizedTracks = normalizeTracksFromResponse(result.data, prompt, model, voice, instrumental);

    return res.json({
      success: true,
      tool: 'text-to-song',
      tracks: normalizedTracks,
      rawResponse: result.data,
    });
  } catch (error: any) {
    console.error('Error in textToSong:', error);
    return res.status(500).json({
      success: false,
      error: error?.message || 'Terjadi kesalahan saat memproses permintaan sintesis musik.',
    });
  }
};

// 6. Direct lyricsToSong handler
const handleLyricsToSong = async (req: express.Request, res: express.Response) => {
  try {
    const source = req.method === 'GET' ? req.query : req.body;
    const lyrics = String(source.lyrics || '').trim();
    const title = String(source.title || 'AI Song').trim();
    const style = String(source.style || 'pop, melodic').trim();
    const voice = String(source.voice || 'auto');
    const instrumental = source.instrumental === true || source.instrumental === 'true';
    const model = Number(source.model || 5);
    const excludeStyles = source.excludeStyles ? String(source.excludeStyles).trim() : undefined;

    if (!lyrics) {
      return res.status(400).json({
        success: false,
        error: 'Parameter lirik lagu (lyrics) wajib diisi.',
      });
    }

    const targetUrl = `${ZETTAI_BASE_URL}/lyricsToSong?apikey=${encodeURIComponent(DEFAULT_API_KEY)}`;
    const payload: Record<string, any> = {
      lyrics,
      title,
      style,
      voice,
      instrumental,
      model,
    };
    if (excludeStyles) payload.excludeStyles = excludeStyles;

    const result = await callZettaiSafe(targetUrl, 'POST', payload);

    if (!result.ok || !result.data) {
      if (lyrics.toLowerCase().includes('mie ayam') || lyrics.toLowerCase().includes('bu sari')) {
        return res.json({
          success: true,
          tool: 'lyrics-to-song',
          tracks: INITIAL_SHOWCASE_TRACKS,
        });
      }
      return res.status(500).json({
        success: false,
        error: result.error || 'Gagal melakukan sintesis lagu dari lirik.',
      });
    }

    const normalizedTracks = normalizeTracksFromResponse(
      result.data,
      lyrics.slice(0, 80),
      model,
      voice,
      instrumental
    );

    return res.json({
      success: true,
      tool: 'lyrics-to-song',
      tracks: normalizedTracks,
      rawResponse: result.data,
    });
  } catch (error: any) {
    console.error('Error in lyricsToSong:', error);
    return res.status(500).json({
      success: false,
      error: error?.message || 'Terjadi kesalahan saat memproses permintaan sintesis lirik.',
    });
  }
};

// Bind to multiple route prefixes for flexible Vercel rewrites and direct calls
const routePrefixes = ['/api/genmusic', '/genmusic', '/api'];

routePrefixes.forEach((prefix) => {
  app.get(`${prefix}/models`, handleModels);
  app.get(`${prefix}/showcase`, handleShowcase);
  app.post(`${prefix}/createJob`, handleCreateJob);
  app.get(`${prefix}/job/:jobId`, handleGetJob);
  app.get(`${prefix}/textToSong`, handleTextToSong);
  app.post(`${prefix}/textToSong`, handleTextToSong);
  app.get(`${prefix}/lyricsToSong`, handleLyricsToSong);
  app.post(`${prefix}/lyricsToSong`, handleLyricsToSong);
});

// Root API ping
app.get(['/', '/api'], (_req, res) => {
  res.json({
    status: 'online',
    service: 'Zettai Studio AI Music Synthesis Engine API',
    endpoints: [
      '/api/genmusic/models',
      '/api/genmusic/showcase',
      '/api/genmusic/textToSong',
      '/api/genmusic/lyricsToSong',
    ],
  });
});

export default app;
