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

  // 3. Generate music via textToSong (supports both GET query params and POST body)
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
      const controller = new AbortController();
      // Music synthesis takes ~45-95 seconds
      const timeout = setTimeout(() => controller.abort(), 180000);

      const response = await fetch(targetUrl, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
        },
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
      console.error('Error in /api/genmusic/textToSong:', error);
      return res.status(500).json({
        success: false,
        error:
          error?.name === 'AbortError'
            ? 'Waktu tunggu sintesis habis (lebih dari 3 menit). Silakan coba lagi.'
            : error?.message || 'Terjadi kesalahan saat menghubungi server Zettai API.',
      });
    }
  };

  app.get('/api/genmusic/textToSong', handleTextToSong);
  app.post('/api/genmusic/textToSong', handleTextToSong);

  // 4. Generate music from custom lyrics via lyricsToSong
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
      const timeout = setTimeout(() => controller.abort(), 180000);

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

      const normalizedTracks = normalizeTracksFromResponse(data, lyrics.slice(0, 80), model, voice, instrumental);

      return res.json({
        success: true,
        tool: 'lyrics-to-song',
        tracks: normalizedTracks,
        rawResponse: data,
      });
    } catch (error: any) {
      console.error('Error in /api/genmusic/lyricsToSong:', error);
      return res.status(500).json({
        success: false,
        error:
          error?.name === 'AbortError'
            ? 'Waktu tunggu sintesis habis (lebih dari 3 menit). Silakan coba lagi.'
            : error?.message || 'Terjadi kesalahan saat menghubungi server Zettai API.',
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
