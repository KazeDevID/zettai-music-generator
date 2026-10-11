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

export interface ZettaiModelInfo {
  id: number;
  name: string;
  description: string;
}

export interface PresetPrompt {
  id: string;
  label: string;
  prompt: string;
  style: string;
  model: number;
  voice: 'auto' | 'female' | 'male' | 'random';
  instrumental: boolean;
  category: string;
}

export const PRESET_PROMPTS: PresetPrompt[] = [
  {
    id: 'mie-ayam',
    label: 'Seporsi Mie Ayam Sebelum Mati',
    prompt: 'seporsi mie ayam sebelum mati',
    style: 'indie rock, sardonic humor, mid-tempo loping groove, warm bass, live drums',
    model: 5,
    voice: 'auto',
    instrumental: false,
    category: 'Indie Nusantara',
  },
  {
    id: 'jakarta-rain',
    label: 'Kopi Susu di Sudut Sudirman Saat Hujan',
    prompt: 'kopi susu hangat di sudut sudirman saat hujan deras malam hari, suasana city pop jakarta 80an',
    style: 'indonesian city pop, warm rhodes piano, groovy slap bass, nostalgic female vocal',
    model: 5,
    voice: 'female',
    instrumental: false,
    category: 'City Pop',
  },
  {
    id: 'kroncong-modern',
    label: 'Senja di Pelabuhan Lama',
    prompt: 'lagu akustik folk senja di pelabuhan lama dengan petikan gitar hangat dan cerita pulang kampung',
    style: 'acoustic folk, warm fingerstyle guitar, cello, intimate male vocals',
    model: 5,
    voice: 'male',
    instrumental: false,
    category: 'Acoustic Folk',
  },
  {
    id: 'synth-midnight',
    label: 'Tol Cipularang Jam Dua Pagi (Instrumental)',
    prompt: 'perjalanan malam di jalan tol cipularang jam dua pagi, lampu jalan kabut tipis, synthwave atmosferik',
    style: 'atmospheric synthwave, analog arpeggio, deep sub bass, nocturnal chill',
    model: 5,
    voice: 'auto',
    instrumental: true,
    category: 'Instrumental',
  },
];

export const SAMPLE_LYRICS_TEMPLATE = `[Verse 1]
Di warung Bu Sari, kursi plastik miring
Hujan mengetuk seng, kuahnya masih bening
Kertas menu lengket di meja nomor tiga
Aku pesan mie ayam, jangan banyak drama

[Chorus]
Seporsi mie ayam sebelum mati
Pangsit dua, sambal sedikit lagi
Kalau hidup cuma antrean panjang
Setidaknya kuahnya jangan kurang matang

[Bridge]
Tak perlu pidato, tak perlu karangan bunga
Cukup bayar lunas, bilang terima kasih saja`;

export const INITIAL_SHOWCASE_TRACKS: TrackItem[] = [
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

export function formatDuration(seconds: number): string {
  if (!seconds || isNaN(seconds)) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

export function normalizeTracksFromResponse(
  data: any,
  fallbackPrompt: string,
  fallbackModelId: number,
  fallbackVoice: string,
  fallbackInstrumental: boolean
): TrackItem[] {
  const results: TrackItem[] = [];
  if (Array.isArray(data?.tracks) && data.tracks.length > 0) {
    data.tracks.forEach((t: any, idx: number) => {
      const durationNum =
        typeof t.duration === 'number'
          ? Math.round(t.duration)
          : typeof t.raw?.duration === 'number'
          ? Math.round(t.raw.duration)
          : 120;
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

