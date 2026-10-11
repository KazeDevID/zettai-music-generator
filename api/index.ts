import express from 'express';
import {
  INITIAL_SHOWCASE_TRACKS,
  normalizeTracksFromResponse,
} from '../src/types';

const app = express();
app.use(express.json());

const ZETTAI_BASE_URL = 'https://zettai.my.id/api/v1/genmusic';
const DEFAULT_API_KEY = process.env.ZETTAI_API_KEY || 'zet_free100';

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

// 3. textToSong handler
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
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 120000);

    const response = await fetch(targetUrl, {
      method: 'GET',
      headers: { Accept: 'application/json' },
      signal: controller.signal,
    });
    clearTimeout(timeout);

    const data = await response.json();

    if (!response.ok || data.success === false) {
      return res.status(response.status !== 200 ? response.status : 500).json({
        success: false,
        error: data.message || data.error || 'Gagal melakukan sintesis lagu dari server Zettai.',
        details: data,
      });
    }

    const normalizedTracks = normalizeTracksFromResponse(data, prompt, model, voice, instrumental);

    return res.json({
      success: true,
      tool: 'text-to-song',
      tracks: normalizedTracks,
      rawResponse: data,
    });
  } catch (error: any) {
    console.error('Error in textToSong:', error);
    return res.status(500).json({
      success: false,
      error:
        error?.name === 'AbortError'
          ? 'Waktu tunggu sintesis habis di serverless proxy. Silakan coba kembali.'
          : error?.message || 'Terjadi kesalahan saat memproses permintaan sintesis musik.',
    });
  }
};

// 4. lyricsToSong handler
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
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 120000);

    const payload: Record<string, any> = {
      lyrics,
      title,
      style,
      voice,
      instrumental,
      model,
    };
    if (excludeStyles) payload.excludeStyles = excludeStyles;

    const response = await fetch(targetUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });
    clearTimeout(timeout);

    const data = await response.json();

    if (!response.ok || data.success === false) {
      return res.status(response.status !== 200 ? response.status : 500).json({
        success: false,
        error: data.message || data.error || 'Gagal melakukan sintesis lagu dari lirik.',
        details: data,
      });
    }

    const normalizedTracks = normalizeTracksFromResponse(
      data,
      lyrics.slice(0, 80),
      model,
      voice,
      instrumental
    );

    return res.json({
      success: true,
      tool: 'lyrics-to-song',
      tracks: normalizedTracks,
      rawResponse: data,
    });
  } catch (error: any) {
    console.error('Error in lyricsToSong:', error);
    return res.status(500).json({
      success: false,
      error:
        error?.name === 'AbortError'
          ? 'Waktu tunggu sintesis habis di serverless proxy. Silakan coba kembali.'
          : error?.message || 'Terjadi kesalahan saat memproses permintaan sintesis lirik.',
    });
  }
};

// Bind to multiple route prefixes for flexible Vercel rewrites and direct calls
const routePrefixes = ['/api/genmusic', '/genmusic', '/api'];

routePrefixes.forEach((prefix) => {
  app.get(`${prefix}/models`, handleModels);
  app.get(`${prefix}/showcase`, handleShowcase);
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
