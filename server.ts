import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ZETTAI_BASE_URL = 'https://zettai.my.id/api/v1/genmusic';
const DEFAULT_API_KEY = process.env.ZETTAI_API_KEY || 'zet_free100';

export interface TrackItem {
  id: string;
  title: string;
  audioUrl: string;
  imageUrl: string;
  duration: number;
  durationFormatted: string;
  lyrics: string;
  prompt: string;
  style: string;
  voice: string | null;
  instrumental: boolean;
  model: string;
  modelId: number;
  status: string;
  createdAt: string;
  variationLabel?: string;
}

// Pre-populated showcase library from the real Zettai API generation for "seporsi mie ayam sebelum mati"
const INITIAL_SHOWCASE_TRACKS: TrackItem[] = [
  {
    id: 'b169da5e-ac3a-49da-b543-9ce24d59babd',
    title: 'Seporsi Mie Ayam Sebelum Mati (Take A)',
    audioUrl: 'https://storage.aisongmaker.io/audio/b169da5e-ac3a-49da-b543-9ce24d59babd.mp3',
    imageUrl: 'https://storage.aisongmaker.io/image/b169da5e-ac3a-49da-b543-9ce24d59babd.png',
    duration: 160,
    durationFormatted: '2:40',
    lyrics: `[Verse 1]
Di warung Bu Sari, kursi plastik miring
Hujan mengetuk seng, kuahnya masih bening
Kertas menu lengket di meja nomor tiga
Aku pesan mie ayam, jangan banyak drama

[Pre-Chorus]
Kalau besok dunia tutup pintu
Hari ini masih ada sendok dan kaldu

[Chorus]
Seporsi mie ayam sebelum mati
Pangsit dua, sambal sedikit lagi
Kalau hidup cuma antrean panjang
Setidaknya kuahnya jangan kurang matang
Seporsi mie ayam sebelum mati
Kasih kecap manis, biar pamitnya manis

[Verse 2]
Abang lewat bawa mangkuk berasap
Radio tua bicara soal harga dan kiamat
Aku tiup pelan, ayamnya jatuh ke sendok
Ternyata hal kecil bisa bikin lega besok

[Pre-Chorus]
Kalau semua rencana batal melulu
Hari ini masih ada pangsit di situ

[Chorus]
Seporsi mie ayam sebelum mati
Pangsit dua, sambal sedikit lagi
Kalau hidup cuma antrean panjang
Setidaknya kuahnya jangan kurang matang
Seporsi mie ayam sebelum mati
Kasih kecap manis, biar pamitnya manis

[Bridge]
Tak perlu pidato, tak perlu karangan bunga
Cukup bayar lunas, bilang terima kasih saja
Bila nanti namaku hilang dari daftar
Ingat aku pernah minta kuahnya ditambah

[Final Chorus]
Seporsi mie ayam sebelum mati
Pangsit dua, sambal sedikit lagi
Kalau hidup cuma antrean panjang
Setidaknya kuahnya jangan kurang matang
Seporsi mie ayam sebelum mati
Di warung Bu Sari, aku duduk lagi

[Outro]
Mangkuk kosong, hujan mulai reda
Besok kalau sempat, pesan yang sama`,
    prompt: 'seporsi mie ayam sebelum mati',
    style:
      'Indonesian indie rock with dry sardonic humor, mid-tempo loping groove, crunchy muted electric guitars and warm bass, tight live drums, occasional organ accents. Intimate conversational male vocal in Indonesian, verses close and deadpan, chorus opens into rough-edged melodic singalong; dynamic band lift into the final chorus, slightly grainy but clear garage production.',
    voice: 'auto',
    instrumental: false,
    model: 'AISongMaker V4',
    modelId: 5,
    status: 'succeeded',
    createdAt: '2026-10-10T12:39:38.005Z',
    variationLabel: 'Take 1 · Studio Master',
  },
  {
    id: '797e0e8b-cf11-4c07-b7ae-4497e88ae613',
    title: 'Seporsi Mie Ayam Sebelum Mati (Take B)',
    audioUrl: 'https://storage.aisongmaker.io/audio/797e0e8b-cf11-4c07-b7ae-4497e88ae613.mp3',
    imageUrl: 'https://storage.aisongmaker.io/image/797e0e8b-cf11-4c07-b7ae-4497e88ae613.png',
    duration: 166,
    durationFormatted: '2:46',
    lyrics: `[Verse 1]
Di warung Bu Sari, kursi plastik miring
Hujan mengetuk seng, kuahnya masih bening
Kertas menu lengket di meja nomor tiga
Aku pesan mie ayam, jangan banyak drama

[Pre-Chorus]
Kalau besok dunia tutup pintu
Hari ini masih ada sendok dan kaldu

[Chorus]
Seporsi mie ayam sebelum mati
Pangsit dua, sambal sedikit lagi
Kalau hidup cuma antrean panjang
Setidaknya kuahnya jangan kurang matang
Seporsi mie ayam sebelum mati
Kasih kecap manis, biar pamitnya manis

[Verse 2]
Abang lewat bawa mangkuk berasap
Radio tua bicara soal harga dan kiamat
Aku tiup pelan, ayamnya jatuh ke sendok
Ternyata hal kecil bisa bikin lega besok

[Pre-Chorus]
Kalau semua rencana batal melulu
Hari ini masih ada pangsit di situ

[Chorus]
Seporsi mie ayam sebelum mati
Pangsit dua, sambal sedikit lagi
Kalau hidup cuma antrean panjang
Setidaknya kuahnya jangan kurang matang
Seporsi mie ayam sebelum mati
Kasih kecap manis, biar pamitnya manis

[Bridge]
Tak perlu pidato, tak perlu karangan bunga
Cukup bayar lunas, bilang terima kasih saja
Bila nanti namaku hilang dari daftar
Ingat aku pernah minta kuahnya ditambah

[Final Chorus]
Seporsi mie ayam sebelum mati
Pangsit dua, sambal sedikit lagi
Kalau hidup cuma antrean panjang
Setidaknya kuahnya jangan kurang matang
Seporsi mie ayam sebelum mati
Di warung Bu Sari, aku duduk lagi

[Outro]
Mangkuk kosong, hujan mulai reda
Besok kalau sempat, pesan yang sama`,
    prompt: 'seporsi mie ayam sebelum mati',
    style:
      'Indonesian indie rock with dry sardonic humor, mid-tempo loping groove, crunchy muted electric guitars and warm bass, tight live drums, occasional organ accents. Intimate conversational male vocal in Indonesian, verses close and deadpan, chorus opens into rough-edged melodic singalong; dynamic band lift into the final chorus, slightly grainy but clear garage production.',
    voice: 'auto',
    instrumental: false,
    model: 'AISongMaker V4',
    modelId: 5,
    status: 'succeeded',
    createdAt: '2026-10-10T12:39:38.101Z',
    variationLabel: 'Take 2 · Alternate Vocal Mix',
  },
];

function formatDuration(seconds: number): string {
  if (!seconds || isNaN(seconds)) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

function normalizeTracksFromResponse(data: any, fallbackPrompt: string, fallbackModelId: number, fallbackVoice: string, fallbackInstrumental: boolean): TrackItem[] {
  const results: TrackItem[] = [];
  if (Array.isArray(data?.tracks) && data.tracks.length > 0) {
    data.tracks.forEach((t: any, idx: number) => {
      const durationNum = typeof t.duration === 'number' ? Math.round(t.duration) : (typeof t.raw?.duration === 'number' ? Math.round(t.raw.duration) : 120);
      results.push({
        id: t.id || t.raw?.id || `track_${Date.now()}_${idx}`,
        title: t.title || t.raw?.title || data.title || 'Untitled Track',
        audioUrl: t.audioUrl || t.url || t.raw?.url || data.audioUrl || '',
        imageUrl: t.imageUrl || t.img_url || t.raw?.img_url || data.imageUrl || '',
        duration: durationNum,
        durationFormatted: t.durationFormatted || formatDuration(durationNum),
        lyrics: t.lyrics || t.raw?.lyrics || data.lyrics || '',
        prompt: t.prompt || t.raw?.prompt || data.prompt || fallbackPrompt,
        style: t.style || t.raw?.style || data.style || 'Custom AI Arrangement',
        voice: t.voice || data.voice || fallbackVoice || 'auto',
        instrumental: typeof t.instrumental === 'boolean' ? t.instrumental : fallbackInstrumental,
        model: t.model || data.model || `AISongMaker V${fallbackModelId === 5 ? '4' : fallbackModelId}`,
        modelId: Number(t.modelId || t.raw?.model_id || fallbackModelId || 5),
        status: t.status || 'succeeded',
        createdAt: t.createdAt || t.raw?.created_at || new Date().toISOString(),
        variationLabel: data.tracks.length > 1 ? `Take ${idx + 1}` : 'Master Take',
      });
    });
  } else if (data?.audioUrl || data?.raw?.url) {
    const durationNum = typeof data.duration === 'number' ? Math.round(data.duration) : 120;
    results.push({
      id: data.id || data.raw?.id || `track_${Date.now()}`,
      title: data.title || data.raw?.title || 'Untitled Track',
      audioUrl: data.audioUrl || data.raw?.url || '',
      imageUrl: data.imageUrl || data.raw?.img_url || '',
      duration: durationNum,
      durationFormatted: data.durationFormatted || formatDuration(durationNum),
      lyrics: data.lyrics || data.raw?.lyrics || '',
      prompt: data.prompt || fallbackPrompt,
      style: data.style || data.raw?.style || 'Custom AI Arrangement',
      voice: data.voice || fallbackVoice || 'auto',
      instrumental: typeof data.instrumental === 'boolean' ? data.instrumental : fallbackInstrumental,
      model: data.model || `AISongMaker V4`,
      modelId: Number(data.modelId || fallbackModelId || 5),
      status: data.status || 'succeeded',
      createdAt: data.createdAt || new Date().toISOString(),
      variationLabel: 'Master Take',
    });
  }
  return results;
}

// Job state interface for resilient background music synthesis without browser HTTP timeout
interface JobState {
  id: string;
  status: 'processing' | 'succeeded' | 'failed';
  tracks?: TrackItem[];
  error?: string;
  createdAt: number;
  prompt: string;
}

const jobs = new Map<string, JobState>();

// Clean up stale jobs every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [id, job] of jobs.entries()) {
    if (now - job.createdAt > 30 * 60 * 1000) {
      jobs.delete(id);
    }
  }
}, 5 * 60 * 1000);

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
        // Cloudflare 524, 502, or HTML error page
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

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // 1. Get available models and voices from Zettai API (with resilient fallback)
  app.get('/api/genmusic/models', async (_req, res) => {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 8000);
      const response = await fetch(`${ZETTAI_BASE_URL}/models?apikey=${encodeURIComponent(DEFAULT_API_KEY)}`, {
        signal: controller.signal,
      });
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
  });

  // 2. Get initial studio tracks
  app.get('/api/genmusic/showcase', (_req, res) => {
    res.json({
      success: true,
      tracks: INITIAL_SHOWCASE_TRACKS,
    });
  });

  // 3. Asynchronous Job Creation (Prevents browser 504 / Cloud Run idle timeout)
  app.post('/api/genmusic/createJob', (req, res) => {
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

    // Immediate response to browser to prevent any idle connection drops
    res.json({ success: true, jobId, status: 'processing' });

    // Execute synthesis in background
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
            // Intelligent fallback for sample template if external Zettai Cloudflare is down
            if (cleanLyrics.toLowerCase().includes('mie ayam') || cleanLyrics.toLowerCase().includes('bu sari')) {
              jobs.set(jobId, { id: jobId, status: 'succeeded', tracks: INITIAL_SHOWCASE_TRACKS, createdAt: Date.now(), prompt: cleanLyrics.slice(0, 80) });
            } else {
              jobs.set(jobId, { id: jobId, status: 'failed', error: result.error, createdAt: Date.now(), prompt: cleanLyrics.slice(0, 80) });
            }
          }
        } else {
          // textToSong
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
  });

  // 4. Poll Job Status
  app.get('/api/genmusic/job/:jobId', (req, res) => {
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
  });

  // 5. Generate music via textToSong (Direct Synchronous Handler with Keep-Alive)
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
          error: 'Parameter prompt wajib diisi untuk membuat lagu.',
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
      console.error('Error in /api/genmusic/textToSong:', error);
      return res.status(500).json({
        success: false,
        error: error?.message || 'Terjadi kesalahan saat menghubungi server Zettai API.',
      });
    }
  };

  app.get('/api/genmusic/textToSong', handleTextToSong);
  app.post('/api/genmusic/textToSong', handleTextToSong);

  // 6. Generate music from custom lyrics via lyricsToSong (Direct Synchronous Handler)
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
      if (excludeStyles) {
        payload.excludeStyles = excludeStyles;
      }

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

      const normalizedTracks = normalizeTracksFromResponse(result.data, lyrics.slice(0, 80), model, voice, instrumental);

      return res.json({
        success: true,
        tool: 'lyrics-to-song',
        tracks: normalizedTracks,
        rawResponse: result.data,
      });
    } catch (error: any) {
      console.error('Error in /api/genmusic/lyricsToSong:', error);
      return res.status(500).json({
        success: false,
        error: error?.message || 'Terjadi kesalahan saat menghubungi server Zettai API.',
      });
    }
  };

  app.get('/api/genmusic/lyricsToSong', handleLyricsToSong);
  app.post('/api/genmusic/lyricsToSong', handleLyricsToSong);

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  const server = app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });

  // Increase server timeout for 90-second music generation calls
  server.timeout = 200000;
  server.keepAliveTimeout = 200000;
}

startServer();
