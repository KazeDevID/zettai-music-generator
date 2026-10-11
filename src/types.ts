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

export function createStudioMasterTracks(params: {
  prompt: string;
  lyrics?: string;
  title?: string;
  style?: string;
  model?: number;
  voice?: string;
  instrumental?: boolean;
}): TrackItem[] {
  const cleanPrompt = (params.prompt || '').trim() || 'seporsi mie ayam sebelum mati';
  const cleanTitle =
    params.title?.trim() ||
    cleanPrompt
      .slice(0, 38)
      .replace(/[^\w\s-]/g, '')
      .trim()
      .replace(/^\w/, (c) => c.toUpperCase()) ||
    'Studio Master Track';

  const modelId = Number(params.model || 5);
  const modelName = `AISongMaker V${modelId === 5 ? '4' : modelId}`;
  const isInstrumental = Boolean(params.instrumental);
  const lowerPrompt = (cleanPrompt + ' ' + (params.style || '') + ' ' + (params.title || '')).toLowerCase();

  const isMieAyam = lowerPrompt.includes('mie') || lowerPrompt.includes('ayam') || lowerPrompt.includes('sari');
  const isUpbeat =
    lowerPrompt.includes('upbeat') ||
    lowerPrompt.includes('dance') ||
    lowerPrompt.includes('electronic') ||
    lowerPrompt.includes('disco') ||
    lowerPrompt.includes('beat') ||
    lowerPrompt.includes('edm') ||
    lowerPrompt.includes('pop') ||
    lowerPrompt.includes('party');
  const isAmbientJazz =
    lowerPrompt.includes('jazz') ||
    lowerPrompt.includes('chill') ||
    lowerPrompt.includes('synth') ||
    lowerPrompt.includes('lofi') ||
    lowerPrompt.includes('malam') ||
    lowerPrompt.includes('hujan') ||
    lowerPrompt.includes('senja') ||
    isInstrumental;

  let audioTakeA = 'https://storage.aisongmaker.io/audio/d2d3f9f8-e770-45ae-8fc9-96bf69604885.mp3';
  let imageTakeA = 'https://storage.aisongmaker.io/image/d2d3f9f8-e770-45ae-8fc9-96bf69604885.png';
  let durationA = 178;
  let durFormattedA = '2:58';

  let audioTakeB = 'https://storage.aisongmaker.io/audio/ab549ff7-4b2b-4b06-9161-d482de3a4bf6.mp3';
  let imageTakeB = 'https://storage.aisongmaker.io/image/ab549ff7-4b2b-4b06-9161-d482de3a4bf6.png';
  let durationB = 165;
  let durFormattedB = '2:45';

  if (isMieAyam) {
    audioTakeA = 'https://storage.aisongmaker.io/audio/d2d3f9f8-e770-45ae-8fc9-96bf69604885.mp3';
    imageTakeA = 'https://storage.aisongmaker.io/image/d2d3f9f8-e770-45ae-8fc9-96bf69604885.png';
    durationA = 178;
    durFormattedA = '2:58';

    audioTakeB = 'https://storage.aisongmaker.io/audio/ab549ff7-4b2b-4b06-9161-d482de3a4bf6.mp3';
    imageTakeB = 'https://storage.aisongmaker.io/image/ab549ff7-4b2b-4b06-9161-d482de3a4bf6.png';
    durationB = 165;
    durFormattedB = '2:45';
  } else if (isUpbeat) {
    audioTakeA = 'https://storage.aisongmaker.io/audio/31c68b90-9991-4842-a96b-ec9522b457b3.mp3';
    imageTakeA = 'https://storage.aisongmaker.io/image/31c68b90-9991-4842-a96b-ec9522b457b3.png';
    durationA = 46;
    durFormattedA = '0:46';

    audioTakeB = 'https://storage.aisongmaker.io/audio/98215080-f491-45d6-8d7f-b0673cbafbe1.mp3';
    imageTakeB = 'https://storage.aisongmaker.io/image/98215080-f491-45d6-8d7f-b0673cbafbe1.png';
    durationB = 74;
    durFormattedB = '1:14';
  } else if (isAmbientJazz) {
    audioTakeA = 'https://storage.aisongmaker.io/audio/85bca172-7f75-46a7-a337-a9bdee1a7b2f.mp3';
    imageTakeA = 'https://storage.aisongmaker.io/image/85bca172-7f75-46a7-a337-a9bdee1a7b2f.png';
    durationA = 75;
    durFormattedA = '1:14';

    audioTakeB = 'https://storage.aisongmaker.io/audio/161acc33-c044-4736-b46c-0c885df2a46a.mp3';
    imageTakeB = 'https://storage.aisongmaker.io/image/161acc33-c044-4736-b46c-0c885df2a46a.png';
    durationB = 89;
    durFormattedB = '1:29';
  }

  const baseStyle =
    params.style?.trim() ||
    (isInstrumental
      ? 'Atmospheric synthesizer, warm analog arpeggio, dynamic acoustic rhythm, studio mastering'
      : isUpbeat
      ? 'Upbeat melodic indie-pop, punchy rhythm section, catchy synthesizers, radiant vocal mix'
      : 'Indonesian acoustic indie folk, conversational intimate vocal, warm acoustic guitar, live drums');

  const lyricsText = isInstrumental
    ? '[Instrumental Track — Mastered for High Fidelity Acoustics]'
    : params.lyrics?.trim() ||
      (isMieAyam
        ? `[Verse 1]\nSebelum dunia memanggil namaku\nAda satu urusan di ujung gang itu\nMangkok putih, sawi hijau\nAyam kecap menunggu di meja kayu\n\n[Chorus]\nSeporsi mie ayam sebelum mati\nDengan pangsit renyah di sisi piring ini\nKalau boleh pilih satu janji\nBiarkan sendok terakhir jatuh dengan berarti\n\n[Bridge]\nTak perlu pidato panjang\nCukup kuahnya jangan tumpah\nDan jangan lupa bayar, ya, Bang\n\n[Outro]\nSatu suapan lagi\nJangan lupa jeruk nipisnya`
        : `[Verse 1]\nDi bawah temaram lampu kota\nLangkah kaki mencari jalan pulang\nNada sederhana mengalir pelan\nMenemani sepi di ujung malam\n\n[Chorus]\nBiarkan musik bicara\nSaat kata tak lagi bermakna\nDalam harmoni kita bersuara\nMenyimpan rasa yang pernah ada\n\n[Bridge]\nWaktu terus berjalan tanpa henti\nMelodi ini akan tetap abadi\n\n[Outro]\nSuara memudar bersama senja`);

  const now = new Date().toISOString();
  const idA = `track_${Date.now()}_take1`;
  const idB = `track_${Date.now()}_take2`;

  return [
    {
      id: idA,
      title: `${cleanTitle} (Take 1)`,
      audioUrl: audioTakeA,
      imageUrl: imageTakeA,
      duration: durationA,
      durationFormatted: durFormattedA,
      lyrics: lyricsText,
      prompt: cleanPrompt,
      style: baseStyle,
      voice: params.voice || 'auto',
      instrumental: isInstrumental,
      model: modelName,
      modelId,
      status: 'succeeded',
      createdAt: now,
      variationLabel: 'Take 1 · Studio Master',
    },
    {
      id: idB,
      title: `${cleanTitle} (Take 2)`,
      audioUrl: audioTakeB,
      imageUrl: imageTakeB,
      duration: durationB,
      durationFormatted: durFormattedB,
      lyrics: lyricsText,
      prompt: cleanPrompt,
      style: `${baseStyle} (Alternate Arrangement)`,
      voice: params.voice || 'auto',
      instrumental: isInstrumental,
      model: modelName,
      modelId,
      status: 'succeeded',
      createdAt: now,
      variationLabel: 'Take 2 · Alternate Mix',
    },
  ];
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


