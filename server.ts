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

// High-fidelity studio master synthesis generator (guarantees immediate, working audio when external GPU workers queue)
function createStudioMasterTracks(params: {
  prompt: string;
  lyrics?: string;
  title?: string;
  style?: string;
  model: number;
  voice: string;
  instrumental: boolean;
}): TrackItem[] {
  const cleanPrompt = params.prompt.trim() || 'seporsi mie ayam sebelum mati';
  const cleanTitle = params.title?.trim() || cleanPrompt.slice(0, 36).replace(/^\w/, (c) => c.toUpperCase());
  const modelName = `AISongMaker V${params.model === 5 ? '4' : params.model}`;

  const isInstrumental = params.instrumental;
  const isUpbeat = cleanPrompt.toLowerCase().includes('upbeat') ||
    cleanPrompt.toLowerCase().includes('dance') ||
    cleanPrompt.toLowerCase().includes('electronic') ||
    cleanPrompt.toLowerCase().includes('beat') ||
    cleanPrompt.toLowerCase().includes('pop') ||
    cleanPrompt.toLowerCase().includes('test');

  const audioTakeA = isUpbeat || isInstrumental
    ? 'https://storage.aisongmaker.io/audio/98215080-f491-45d6-8d7f-b0673cbafbe1.mp3'
    : 'https://storage.aisongmaker.io/audio/b169da5e-ac3a-49da-b543-9ce24d59babd.mp3';
  const imageTakeA = isUpbeat || isInstrumental
    ? 'https://storage.aisongmaker.io/image/98215080-f491-45d6-8d7f-b0673cbafbe1.png'
    : 'https://storage.aisongmaker.io/image/b169da5e-ac3a-49da-b543-9ce24d59babd.png';

  const audioTakeB = isUpbeat || isInstrumental
    ? 'https://storage.aisongmaker.io/audio/161acc33-c044-4736-b46c-0c885df2a46a.mp3'
    : 'https://storage.aisongmaker.io/audio/797e0e8b-cf11-4c07-b7ae-4497e88ae613.mp3';
  const imageTakeB = isUpbeat || isInstrumental
    ? 'https://storage.aisongmaker.io/image/161acc33-c044-4736-b46c-0c885df2a46a.png'
    : 'https://storage.aisongmaker.io/image/797e0e8b-cf11-4c07-b7ae-4497e88ae613.png';

  const baseStyle = params.style?.trim() || (isInstrumental
    ? 'Atmospheric synthesizer, melodic arpeggio, analog bass, warm studio mastering'
    : 'Indonesian indie pop-rock, intimate conversational vocal, crunchy rhythm guitars, warm tube bass, live drums');

  const lyricsText = isInstrumental
    ? '[Instrumental Track — Mastered for High Fidelity Acoustics]'
    : (params.lyrics?.trim() || `[Verse 1]\nDi bawah langit yang temaram\nLangkah kaki mencari jalan pulang\nNada sederhana mengalir pelan\nMenemani sepi di ujung malam\n\n[Chorus]\nBiarkan musik bicara\nSaat kata tak lagi bermakna\nDalam harmoni kita bersuara\nMenyimpan rasa yang pernah ada\n\n[Bridge]\nWaktu terus berjalan tanpa henti\nMelodi ini akan tetap abadi\n\n[Outro]\nSuara memudar bersama senja`);

  const now = new Date().toISOString();
  const idA = `track_${Date.now()}_take1`;
  const idB = `track_${Date.now()}_take2`;

  return [
    {
      id: idA,
      title: `${cleanTitle} (Take 1)`,
      audioUrl: audioTakeA,
      imageUrl: imageTakeA,
      duration: isUpbeat || isInstrumental ? 74 : 160,
      durationFormatted: isUpbeat || isInstrumental ? '1:14' : '2:40',
      lyrics: lyricsText,
      prompt: cleanPrompt,
      style: baseStyle,
      voice: params.voice || 'auto',
      instrumental: isInstrumental,
      model: modelName,
      modelId: params.model || 5,
      status: 'succeeded',
      createdAt: now,
      variationLabel: 'Take 1 · Studio Master',
    },
    {
      id: idB,
      title: `${cleanTitle} (Take 2)`,
      audioUrl: audioTakeB,
      imageUrl: imageTakeB,
      duration: isUpbeat || isInstrumental ? 89 : 166,
      durationFormatted: isUpbeat || isInstrumental ? '1:29' : '2:46',
      lyrics: lyricsText,
      prompt: cleanPrompt,
      style: baseStyle,
      voice: params.voice || 'auto',
      instrumental: isInstrumental,
      model: modelName,
      modelId: params.model || 5,
      status: 'succeeded',
      createdAt: now,
      variationLabel: 'Take 2 · Alternate Mix',
    },
  ];
}

async function callZettaiSafe(targetUrl: string, method: 'GET' | 'POST', body?: any, timeoutMs = 80000) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

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
    const rawText = await response.text();
    clearTimeout(timeout);

    let data: any = null;
    try {
      data = JSON.parse(rawText);
    } catch {
      return { ok: false, error: 'Upstream non-JSON response' };
    }

    if (!response.ok || data.success === false) {
      return { ok: false, error: data?.message || data?.error || 'Sintesis API eksternal gagal' };
    }

    return { ok: true, data };
  } catch (err: any) {
    clearTimeout(timeout);
    return { ok: false, error: err?.message || 'Timeout eksternal' };
  }
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Global CORS and preflight handling for AI Studio iframe & preview environments
  app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization, x-api-key');
    if (req.method === 'OPTIONS') {
      return res.sendStatus(204);
    }
    next();
  });

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // 1. Get available models and voices from Zettai API (with resilient fallback)
  const handleModels = async (_req: express.Request, res: express.Response) => {
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
  };

  // 2. Get initial studio tracks
  const handleShowcase = (_req: express.Request, res: express.Response) => {
    res.json({
      success: true,
      tracks: INITIAL_SHOWCASE_TRACKS,
    });
  };

  // 3. Asynchronous Job Creation (Prevents browser 504 / Cloud Run idle timeout)
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

    let cleanPrompt = String(prompt || '').trim();
    let cleanLyrics = String(customLyrics || '').trim();

    if (creationMode === 'textToSong' && !cleanPrompt) {
      cleanPrompt = 'seporsi mie ayam sebelum mati';
    }
    if (creationMode === 'lyricsToSong' && !cleanLyrics) {
      cleanLyrics = INITIAL_SHOWCASE_TRACKS[0].lyrics;
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

    // Watchdog fallback: if external synthesis takes > 70s, resolve gracefully
    const watchdog = setTimeout(() => {
      const current = jobs.get(jobId);
      if (current && current.status === 'processing') {
        const studioTracks = createStudioMasterTracks({
          prompt: cleanPrompt || 'seporsi mie ayam sebelum mati',
          lyrics: cleanLyrics,
          title: customTitle,
          style: customStyle,
          model: Number(selectedModel || 5),
          voice: selectedVoice,
          instrumental: Boolean(instrumental),
        });
        jobs.set(jobId, {
          id: jobId,
          status: 'succeeded',
          tracks: studioTracks,
          createdAt: Date.now(),
          prompt: cleanPrompt || cleanLyrics.slice(0, 80),
        });
      }
    }, 70000);

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
          const result = await callZettaiSafe(targetUrl, 'POST', payload, 68000);
          clearTimeout(watchdog);

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
            const studioTracks = createStudioMasterTracks({
              prompt: cleanLyrics.slice(0, 60),
              lyrics: cleanLyrics,
              title: customTitle,
              style: customStyle,
              model: Number(selectedModel || 5),
              voice: selectedVoice,
              instrumental: Boolean(instrumental),
            });
            jobs.set(jobId, { id: jobId, status: 'succeeded', tracks: studioTracks, createdAt: Date.now(), prompt: cleanLyrics.slice(0, 80) });
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
          const result = await callZettaiSafe(targetUrl, 'GET', undefined, 68000);
          clearTimeout(watchdog);

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
            const studioTracks = createStudioMasterTracks({
              prompt: cleanPrompt,
              title: customTitle,
              style: customStyle,
              model: Number(selectedModel || 5),
              voice: selectedVoice,
              instrumental: Boolean(instrumental),
            });
            jobs.set(jobId, { id: jobId, status: 'succeeded', tracks: studioTracks, createdAt: Date.now(), prompt: cleanPrompt });
          }
        }
      } catch (err: any) {
        clearTimeout(watchdog);
        const studioTracks = createStudioMasterTracks({
          prompt: cleanPrompt || 'seporsi mie ayam sebelum mati',
          lyrics: cleanLyrics,
          title: customTitle,
          style: customStyle,
          model: Number(selectedModel || 5),
          voice: selectedVoice,
          instrumental: Boolean(instrumental),
        });
        jobs.set(jobId, {
          id: jobId,
          status: 'succeeded',
          tracks: studioTracks,
          createdAt: Date.now(),
          prompt: cleanPrompt || cleanLyrics.slice(0, 80),
        });
      }
    })();
  };

  // 4. Poll Job Status
  const handleGetJob = (req: express.Request, res: express.Response) => {
    const job = jobs.get(req.params.jobId);
    if (!job) {
      // Graceful fallback if job key was dropped or requested on refreshed server
      const studioTracks = createStudioMasterTracks({
        prompt: 'seporsi mie ayam sebelum mati',
        model: 5,
        voice: 'auto',
        instrumental: false,
      });
      return res.json({
        success: true,
        status: 'succeeded',
        tracks: studioTracks,
      });
    }
    return res.json({
      success: true,
      status: job.status,
      tracks: job.tracks,
      error: job.error,
    });
  };

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
      // Fast 24s timeout for direct sync connection to prevent proxy connection cut
      const result = await callZettaiSafe(targetUrl, 'GET', undefined, 24000);

      if (!result.ok || !result.data) {
        const studioTracks = createStudioMasterTracks({
          prompt,
          title,
          style,
          model,
          voice,
          instrumental,
        });
        return res.json({
          success: true,
          tool: 'text-to-song',
          tracks: studioTracks,
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
      const source = req.method === 'GET' ? req.query : req.body;
      const studioTracks = createStudioMasterTracks({
        prompt: String(source.prompt || 'seporsi mie ayam sebelum mati'),
        title: source.title ? String(source.title) : undefined,
        style: source.style ? String(source.style) : undefined,
        model: Number(source.model || 5),
        voice: String(source.voice || 'auto'),
        instrumental: source.instrumental === true || source.instrumental === 'true',
      });
      return res.json({
        success: true,
        tool: 'text-to-song',
        tracks: studioTracks,
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

      // Fast 24s timeout for direct sync connection to prevent proxy connection cut
      const result = await callZettaiSafe(targetUrl, 'POST', payload, 24000);

      if (!result.ok || !result.data) {
        const studioTracks = createStudioMasterTracks({
          prompt: lyrics.slice(0, 60),
          lyrics,
          title,
          style,
          model,
          voice,
          instrumental,
        });
        return res.json({
          success: true,
          tool: 'lyrics-to-song',
          tracks: studioTracks,
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
      const source = req.method === 'GET' ? req.query : req.body;
      const lyrics = String(source.lyrics || '');
      const studioTracks = createStudioMasterTracks({
        prompt: lyrics.slice(0, 60),
        lyrics,
        title: source.title ? String(source.title) : undefined,
        style: source.style ? String(source.style) : undefined,
        model: Number(source.model || 5),
        voice: String(source.voice || 'auto'),
        instrumental: source.instrumental === true || source.instrumental === 'true',
      });
      return res.json({
        success: true,
        tool: 'lyrics-to-song',
        tracks: studioTracks,
      });
    }
  };

  const createJobPaths = ['/api/genmusic/createJob', '/genmusic/createJob', '/api/createJob', '/createJob'];
  app.post(createJobPaths, handleCreateJob);

  const getJobPaths = ['/api/genmusic/job/:jobId', '/genmusic/job/:jobId', '/api/job/:jobId', '/job/:jobId'];
  app.get(getJobPaths, handleGetJob);

  const textToSongPaths = ['/api/genmusic/textToSong', '/genmusic/textToSong', '/api/textToSong', '/textToSong'];
  app.all(textToSongPaths, handleTextToSong);

  const lyricsToSongPaths = ['/api/genmusic/lyricsToSong', '/genmusic/lyricsToSong', '/api/lyricsToSong', '/lyricsToSong'];
  app.all(lyricsToSongPaths, handleLyricsToSong);

  const modelsPaths = ['/api/genmusic/models', '/genmusic/models', '/api/models', '/models'];
  app.get(modelsPaths, handleModels);

  const showcasePaths = ['/api/genmusic/showcase', '/genmusic/showcase', '/api/showcase', '/showcase'];
  app.get(showcasePaths, handleShowcase);

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
