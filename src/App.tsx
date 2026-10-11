import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  Play,
  Pause,
  Download,
  Volume2,
  VolumeX,
  SkipBack,
  SkipForward,
  Music,
  Sliders,
  FileText,
  Terminal,
  Copy,
  Check,
  Search,
  RefreshCw,
  Trash2,
  Disc,
  Mic,
  Radio,
  Clock,
  ChevronRight,
  AlertCircle,
} from 'lucide-react';
import {
  TrackItem,
  ZettaiModelInfo,
  PRESET_PROMPTS,
  SAMPLE_LYRICS_TEMPLATE,
  PresetPrompt,
  INITIAL_SHOWCASE_TRACKS,
  normalizeTracksFromResponse,
} from './types';

const STORAGE_KEY = 'zettai_studio_saved_tracks_v1';

function formatSeconds(sec: number): string {
  if (!sec || isNaN(sec) || sec < 0) return '0:00';
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}

interface CoverImageProps {
  src: string;
  alt: string;
  className?: string;
}

function CoverArtwork({ src, alt, className = '' }: CoverImageProps) {
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setFailed(false);
  }, [src]);

  if (!src || failed) {
    return (
      <div
        className={`flex flex-col items-center justify-center bg-gradient-to-br from-[#1E293B] via-[#0F172A] to-[#0B0F17] text-slate-400 select-none ${className}`}
      >
        <Disc className="w-8 h-8 text-amber-500/80 mb-1.5" />
        <span className="text-[11px] font-mono tracking-tight text-slate-400 px-2 text-center truncate max-w-full">
          {alt || 'Zettai Master'}
        </span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      referrerPolicy="no-referrer"
      onError={() => setFailed(true)}
      className={`object-cover ${className}`}
    />
  );
}

export default function App() {
  // Navigation & View Mode
  const [activeSection, setActiveSection] = useState<'studio' | 'library' | 'presets' | 'api'>('studio');
  const [creationMode, setCreationMode] = useState<'textToSong' | 'lyricsToSong'>('textToSong');

  // Form State (Defaulting to the exact prompt from the user's request)
  const [prompt, setPrompt] = useState<string>('seporsi mie ayam sebelum mati');
  const [customLyrics, setCustomLyrics] = useState<string>(SAMPLE_LYRICS_TEMPLATE);
  const [customTitle, setCustomTitle] = useState<string>('');
  const [customStyle, setCustomStyle] = useState<string>('');
  const [excludeStyles, setExcludeStyles] = useState<string>('');
  const [selectedModel, setSelectedModel] = useState<number>(5);
  const [selectedVoice, setSelectedVoice] = useState<'auto' | 'female' | 'male' | 'random'>('auto');
  const [instrumental, setInstrumental] = useState<boolean>(false);

  // Models & Tracks State
  const [models, setModels] = useState<ZettaiModelInfo[]>([
    { id: 1, name: 'AISongMaker V1', description: 'Efficient creation' },
    { id: 2, name: 'AISongMaker V2', description: 'Enhanced quality' },
    { id: 3, name: 'AISongMaker V2.1', description: 'Creative exploration, dynamic results' },
    { id: 4, name: 'AISongMaker V3', description: 'Bold exploration, diverse results' },
    { id: 5, name: 'AISongMaker V4', description: 'Stable quality, precise control' },
  ]);
  const [tracks, setTracks] = useState<TrackItem[]>([]);
  const [isLoadingInitial, setIsLoadingInitial] = useState<boolean>(true);

  // Synthesis Execution State
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Library Filter & Search State
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [vocalFilter, setVocalFilter] = useState<'all' | 'vocal' | 'instrumental'>('all');

  // Active Track & Audio Player State
  const [selectedTrackId, setSelectedTrackId] = useState<string>('');
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [volume, setVolume] = useState<number>(0.85);
  const [isMuted, setIsMuted] = useState<boolean>(false);

  // Copy states
  const [copiedLyrics, setCopiedLyrics] = useState<boolean>(false);
  const [copiedEndpoint, setCopiedEndpoint] = useState<boolean>(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const studioRef = useRef<HTMLDivElement | null>(null);
  const libraryRef = useRef<HTMLDivElement | null>(null);
  const presetsRef = useRef<HTMLDivElement | null>(null);
  const apiRef = useRef<HTMLDivElement | null>(null);

  // Load initial models & showcase tracks + merge with localStorage
  useEffect(() => {
    let mounted = true;

    async function bootstrapStudio() {
      try {
        const [modelsRes, showcaseRes] = await Promise.all([
          fetch('/api/genmusic/models')
            .then((r) => (r.ok ? r.json() : null))
            .catch(() => null),
          fetch('/api/genmusic/showcase')
            .then((r) => (r.ok ? r.json() : null))
            .catch(() => null),
        ]);

        if (!mounted) return;

        if (modelsRes?.models && Array.isArray(modelsRes.models)) {
          setModels(modelsRes.models);
        }

        let savedTracks: TrackItem[] = [];
        try {
          const rawSaved = localStorage.getItem(STORAGE_KEY);
          if (rawSaved) {
            savedTracks = JSON.parse(rawSaved);
          }
        } catch {
          // ignore storage error
        }

        const serverTracks: TrackItem[] =
          Array.isArray(showcaseRes?.tracks) && showcaseRes.tracks.length > 0
            ? showcaseRes.tracks
            : INITIAL_SHOWCASE_TRACKS;
        const mergedMap = new Map<string, TrackItem>();

        savedTracks.forEach((t) => mergedMap.set(t.id, t));
        serverTracks.forEach((t) => {
          if (!mergedMap.has(t.id)) {
            mergedMap.set(t.id, t);
          }
        });

        const mergedList = Array.from(mergedMap.values());
        setTracks(mergedList);
        if (mergedList.length > 0) {
          setSelectedTrackId(mergedList[0].id);
        }
      } finally {
        if (mounted) {
          setIsLoadingInitial(false);
        }
      }
    }

    bootstrapStudio();
    return () => {
      mounted = false;
    };
  }, []);

  // Elapsed timer while generating music
  useEffect(() => {
    if (!isGenerating) {
      setElapsedSeconds(0);
      return;
    }
    const interval = setInterval(() => {
      setElapsedSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [isGenerating]);

  const activeTrack = useMemo(() => {
    return tracks.find((t) => t.id === selectedTrackId) || tracks[0] || null;
  }, [tracks, selectedTrackId]);

  const filteredTracks = useMemo(() => {
    return tracks.filter((track) => {
      if (vocalFilter === 'vocal' && track.instrumental) return false;
      if (vocalFilter === 'instrumental' && !track.instrumental) return false;
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return (
        track.title.toLowerCase().includes(q) ||
        track.prompt.toLowerCase().includes(q) ||
        track.style.toLowerCase().includes(q) ||
        track.lyrics.toLowerCase().includes(q)
      );
    });
  }, [tracks, searchQuery, vocalFilter]);

  // Sync audio element when track changes
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !activeTrack) return;

    if (audio.src !== activeTrack.audioUrl) {
      audio.src = activeTrack.audioUrl;
      audio.load();
      setCurrentTime(0);
      setDuration(activeTrack.duration || 0);
      if (isPlaying) {
        audio.play().catch(() => setIsPlaying(false));
      }
    }
  }, [activeTrack]);

  // Sync volume/mute
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = isMuted ? 0 : volume;
  }, [volume, isMuted]);

  const togglePlayPause = () => {
    const audio = audioRef.current;
    if (!audio || !activeTrack) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => setIsPlaying(false));
    }
  };

  const selectAndPlayTrack = (track: TrackItem) => {
    const audio = audioRef.current;
    if (selectedTrackId === track.id) {
      togglePlayPause();
      return;
    }
    setSelectedTrackId(track.id);
    setIsPlaying(true);
    if (audio) {
      audio.src = track.audioUrl;
      audio.load();
      audio.play().catch(() => setIsPlaying(false));
    }
  };

  const handleSkip = (direction: 'prev' | 'next') => {
    if (tracks.length === 0) return;
    const currentIndex = tracks.findIndex((t) => t.id === selectedTrackId);
    let nextIndex = 0;
    if (direction === 'next') {
      nextIndex = currentIndex + 1 < tracks.length ? currentIndex + 1 : 0;
    } else {
      nextIndex = currentIndex - 1 >= 0 ? currentIndex - 1 : tracks.length - 1;
    }
    selectAndPlayTrack(tracks[nextIndex]);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = Number(e.target.value);
    setCurrentTime(newTime);
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
    }
  };

  const saveTracksToStorage = (updatedTracks: TrackItem[]) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedTracks.slice(0, 30)));
    } catch {
      // ignore quota errors
    }
  };

  const handleGenerateMusic = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isGenerating) return;

    setErrorMessage(null);

    if (creationMode === 'textToSong' && !prompt.trim()) {
      setErrorMessage('Masukkan deskripsi atau tema lagu terlebih dahulu.');
      return;
    }

    if (creationMode === 'lyricsToSong' && !customLyrics.trim()) {
      setErrorMessage('Masukkan lirik lagu terlebih dahulu.');
      return;
    }

    setIsGenerating(true);

    try {
      // 1. Initiate job on server (immediate response prevents 504 gateway timeout)
      const initResponse = await fetch('/api/genmusic/createJob', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          creationMode,
          prompt: prompt.trim(),
          customLyrics: customLyrics.trim(),
          selectedModel,
          selectedVoice,
          instrumental,
          customStyle: customStyle.trim(),
          customTitle: customTitle.trim(),
          excludeStyles: excludeStyles.trim(),
        }),
      });

      if (!initResponse.ok) {
        const errJson = await initResponse.json().catch(() => null);
        throw new Error(errJson?.error || 'Gagal memulai proses sintesis lagu di server.');
      }

      const initData = await initResponse.json();
      const jobId = initData.jobId;

      if (!jobId) {
        throw new Error('Gagal mendapatkan ID tugas sintesis musik dari server.');
      }

      // 2. Poll job status every 1.5 seconds until completion
      let resolvedTracks: TrackItem[] | null = null;
      let pollCount = 0;
      const maxPolls = 85; // 85 * 1.5s = ~127s
      let networkGlitchCount = 0;

      while (!resolvedTracks && pollCount < maxPolls) {
        await new Promise((resolve) => setTimeout(resolve, 1500));
        pollCount++;

        try {
          const pollRes = await fetch(`/api/genmusic/job/${jobId}`);
          networkGlitchCount = 0;

          if (pollRes.ok) {
            const jobData = await pollRes.json();
            if (jobData.status === 'succeeded' && Array.isArray(jobData.tracks) && jobData.tracks.length > 0) {
              resolvedTracks = jobData.tracks;
              break;
            }
            if (jobData.status === 'failed') {
              throw new Error(jobData.error || 'Gagal melakukan sintesis lagu dari engine Zettai.');
            }
          }
        } catch (pollErr: any) {
          // If the error was explicitly thrown by the job failure, rethrow it
          if (pollErr.message && !pollErr.message.includes('fetch')) {
            throw pollErr;
          }
          networkGlitchCount++;
          // Tolerate temporary network glitches during polling
          if (networkGlitchCount >= 8) {
            throw new Error('Koneksi terputus saat memeriksa status lagu. Silakan periksa jaringan Anda.');
          }
        }
      }

      if (!resolvedTracks || resolvedTracks.length === 0) {
        throw new Error('Waktu tunggu sintesis musik habis. Server Zettai sedang mengalami antrean panjang.');
      }

      setTracks((prev) => {
        const existingIds = new Set(resolvedTracks!.map((t) => t.id));
        const filteredPrev = prev.filter((p) => !existingIds.has(p.id));
        const combined = [...resolvedTracks!, ...filteredPrev];
        saveTracksToStorage(combined);
        return combined;
      });

      // Automatically select and play the newly synthesized track
      setSelectedTrackId(resolvedTracks[0].id);
      setIsPlaying(true);
      if (audioRef.current) {
        audioRef.current.src = resolvedTracks[0].audioUrl;
        audioRef.current.load();
        audioRef.current.play().catch(() => setIsPlaying(false));
      }
    } catch (err: any) {
      setErrorMessage(err?.message || 'Terjadi gangguan saat memproses sintesis lagu.');
    } finally {
      setIsGenerating(false);
    }
  };

  const applyPreset = (preset: PresetPrompt) => {
    setCreationMode('textToSong');
    setPrompt(preset.prompt);
    setCustomStyle(preset.style);
    setSelectedModel(preset.model);
    setSelectedVoice(preset.voice);
    setInstrumental(preset.instrumental);
    setActiveSection('studio');
    studioRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleDeleteTrack = (id: string) => {
    setTracks((prev) => {
      const updated = prev.filter((t) => t.id !== id);
      saveTracksToStorage(updated);
      if (selectedTrackId === id && updated.length > 0) {
        setSelectedTrackId(updated[0].id);
      }
      return updated;
    });
  };

  const liveEndpointPreview = useMemo(() => {
    const p = encodeURIComponent(prompt.trim() || 'seporsi mie ayam sebelum mati');
    const m = selectedModel;
    const v = selectedVoice;
    const i = instrumental;
    return `https://zettai.my.id/api/v1/genmusic/textToSong?prompt=${p}&model=${m}&voice=${v}&instrumental=${i}&apikey=zet_free100`;
  }, [prompt, selectedModel, selectedVoice, instrumental]);

  const handleCopyLyrics = () => {
    if (!activeTrack?.lyrics) return;
    navigator.clipboard.writeText(activeTrack.lyrics);
    setCopiedLyrics(true);
    setTimeout(() => setCopiedLyrics(false), 2000);
  };

  const handleCopyEndpoint = () => {
    navigator.clipboard.writeText(liveEndpointPreview);
    setCopiedEndpoint(true);
    setTimeout(() => setCopiedEndpoint(false), 2000);
  };

  const scrollToSection = (section: 'studio' | 'library' | 'presets' | 'api') => {
    setActiveSection(section);
    const map = {
      studio: studioRef,
      library: libraryRef,
      presets: presetsRef,
      api: apiRef,
    };
    map[section].current?.scrollIntoView({ behavior: 'smooth' });
  };

  const synthesisPhaseText = useMemo(() => {
    if (elapsedSeconds < 12) return 'Mengirim parameter prompt & inisialisasi model AISongMaker...';
    if (elapsedSeconds < 30) return 'Menyusun struktur lirik, bait, chorus, dan progresi akor...';
    if (elapsedSeconds < 55) return 'Mensintesis instrumen, vokal utama, dan dinamika aransemen...';
    return 'Merender master audio MP3 dan artwork sampul lagu...';
  }, [elapsedSeconds]);

  return (
    <div className="min-h-screen flex flex-col bg-[#0B0F17] text-[#F8FAFC] pb-28">
      {/* Hidden HTML5 Audio Engine */}
      <audio
        ref={audioRef}
        onTimeUpdate={() => {
          if (audioRef.current) {
            setCurrentTime(audioRef.current.currentTime);
          }
        }}
        onLoadedMetadata={() => {
          if (audioRef.current && audioRef.current.duration && !isNaN(audioRef.current.duration)) {
            setDuration(audioRef.current.duration);
          }
        }}
        onEnded={() => setIsPlaying(false)}
        onPause={() => setIsPlaying(false)}
        onPlay={() => setIsPlaying(true)}
      />

      {/* Top Navigation Bar — Strict 3-Zone Contract */}
      <header className="sticky top-0 z-30 flex items-center justify-between gap-8 px-6 py-4 bg-[#0B0F17]/95 backdrop-blur-md border-b border-slate-800/80">
        {/* Zone 1: Single text element wordmark */}
        <a
          href="#studio"
          onClick={(e) => {
            e.preventDefault();
            scrollToSection('studio');
          }}
          className="text-lg font-bold tracking-tight text-white font-display whitespace-nowrap shrink-0"
        >
          Zettai Studio
        </a>

        {/* Zone 2: 4 concise single-line navigation links */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-400">
          <a
            href="#studio"
            onClick={(e) => {
              e.preventDefault();
              scrollToSection('studio');
            }}
            className={`hover:text-white transition-colors whitespace-nowrap shrink-0 ${
              activeSection === 'studio' ? 'text-white underline underline-offset-8 decoration-amber-500' : ''
            }`}
          >
            Synthesis Studio
          </a>
          <a
            href="#library"
            onClick={(e) => {
              e.preventDefault();
              scrollToSection('library');
            }}
            className={`hover:text-white transition-colors whitespace-nowrap shrink-0 ${
              activeSection === 'library' ? 'text-white underline underline-offset-8 decoration-amber-500' : ''
            }`}
          >
            Track Library
          </a>
          <a
            href="#presets"
            onClick={(e) => {
              e.preventDefault();
              scrollToSection('presets');
            }}
            className={`hover:text-white transition-colors whitespace-nowrap shrink-0 ${
              activeSection === 'presets' ? 'text-white underline underline-offset-8 decoration-amber-500' : ''
            }`}
          >
            Prompt Presets
          </a>
          <a
            href="#api"
            onClick={(e) => {
              e.preventDefault();
              scrollToSection('api');
            }}
            className={`hover:text-white transition-colors whitespace-nowrap shrink-0 ${
              activeSection === 'api' ? 'text-white underline underline-offset-8 decoration-amber-500' : ''
            }`}
          >
            API Inspector
          </a>
        </nav>

        {/* Zone 3: 1 Primary CTA button */}
        <div className="flex items-center shrink-0">
          <button
            type="button"
            onClick={() => {
              scrollToSection('studio');
              const inputEl = document.getElementById('prompt-textarea');
              inputEl?.focus();
            }}
            className="px-4 py-2 text-xs font-semibold text-slate-950 bg-amber-500 rounded-lg hover:bg-amber-400 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            Buat Lagu Baru
          </button>
        </div>
      </header>

      {/* Main Content Container (1440px Desktop Presence) */}
      <main className="flex-1 w-full max-w-[1380px] mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-14">
        {/* SECTION 1: Studio Workspace Split (Prompt Synthesizer + Active Track Inspector) */}
        <section ref={studioRef} id="studio" className="scroll-mt-24">
          <div className="mb-6 flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-800/80 pb-5">
            <div>
              <p className="text-xs font-mono text-amber-400/90 mb-1.5">
                Zettai Music API v1 · AISongMaker V4 Engine · Node.js + React Studio
              </p>
              <h1
                className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white tracking-tight font-display"
                style={{ textWrap: 'balance' }}
              >
                Generator Musik & Lagu AI dari Deskripsi Teks
              </h1>
            </div>
            <p className="text-sm text-slate-400 max-w-md">
              Ketik ide cerita, suasana hati, atau lirik lengkap untuk menghasilkan lagu berdurasi penuh lengkap dengan vokal dan aransemen instrumen.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            {/* LEFT COLUMN (7 Cols): Synthesis Parameter Console */}
            <div className="lg:col-span-7 bg-[#111723] border border-slate-800/90 rounded-xl p-6 flex flex-col justify-between">
              <form onSubmit={handleGenerateMusic} className="space-y-6">
                {/* Mode Selector Tabs (Functional Interactive Segmented Control) */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800/80">
                  <div>
                    <h2 className="text-base font-semibold text-white">Konfigurasi Sintesis Lagu</h2>
                    <p className="text-xs text-slate-400">
                      Pilih metode pembuatan dari prompt kalimat singkat atau lirik kustom
                    </p>
                  </div>
                  <div className="flex items-center gap-1 p-1 bg-[#0B0F17] border border-slate-800 rounded-lg self-start">
                    <button
                      type="button"
                      onClick={() => setCreationMode('textToSong')}
                      className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                        creationMode === 'textToSong'
                          ? 'bg-amber-500 text-slate-950 font-semibold'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      Text to Song
                    </button>
                    <button
                      type="button"
                      onClick={() => setCreationMode('lyricsToSong')}
                      className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                        creationMode === 'lyricsToSong'
                          ? 'bg-amber-500 text-slate-950 font-semibold'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      Lyrics to Song
                    </button>
                  </div>
                </div>

                {/* Primary Input Area */}
                {creationMode === 'textToSong' ? (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label htmlFor="prompt-textarea" className="text-xs font-medium text-slate-300">
                        Deskripsi Lagu (Prompt)
                      </label>
                      <span className="text-xs font-mono text-slate-400 tabular-nums">
                        {prompt.length} karakter
                      </span>
                    </div>
                    <textarea
                      id="prompt-textarea"
                      rows={3}
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      placeholder="Contoh: seporsi mie ayam sebelum mati"
                      disabled={isGenerating}
                      className="w-full rounded-lg bg-[#0B0F17] border border-slate-800 px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 transition-colors resize-none"
                    />
                    <div className="flex flex-wrap items-center gap-2 pt-1">
                      <span className="text-xs text-slate-400">Contoh cepat:</span>
                      {PRESET_PROMPTS.map((preset) => (
                        <button
                          key={preset.id}
                          type="button"
                          onClick={() => {
                            setPrompt(preset.prompt);
                            setCustomStyle(preset.style);
                            setSelectedModel(preset.model);
                            setSelectedVoice(preset.voice);
                            setInstrumental(preset.instrumental);
                          }}
                          className="text-xs text-slate-300 hover:text-amber-400 underline underline-offset-4 decoration-slate-700 hover:decoration-amber-400 transition-colors cursor-pointer"
                        >
                          {preset.label}
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label htmlFor="lyrics-textarea" className="text-xs font-medium text-slate-300">
                        Lirik Lagu Lengkap (Gunakan penanda [Verse], [Chorus], [Bridge])
                      </label>
                      <button
                        type="button"
                        onClick={() => setCustomLyrics(SAMPLE_LYRICS_TEMPLATE)}
                        className="text-xs text-amber-400 hover:text-amber-300 transition-colors cursor-pointer"
                      >
                        Muat Contoh Lirik
                      </button>
                    </div>
                    <textarea
                      id="lyrics-textarea"
                      rows={6}
                      value={customLyrics}
                      onChange={(e) => setCustomLyrics(e.target.value)}
                      placeholder="[Verse 1]\nKetik bait lagu di sini...\n\n[Chorus]\nKetik bagian reff di sini..."
                      disabled={isGenerating}
                      className="w-full rounded-lg bg-[#0B0F17] border border-slate-800 px-4 py-3 text-sm font-mono text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 transition-colors resize-y"
                    />
                  </div>
                )}

                {/* Model & Vocal Parameter Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {/* Model Selection */}
                  <div className="space-y-2">
                    <label htmlFor="model-select" className="block text-xs font-medium text-slate-300">
                      Model AI Engine
                    </label>
                    <select
                      id="model-select"
                      value={selectedModel}
                      onChange={(e) => setSelectedModel(Number(e.target.value))}
                      disabled={isGenerating}
                      className="w-full rounded-lg bg-[#0B0F17] border border-slate-800 px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500 transition-colors"
                    >
                      {models.map((m) => (
                        <option key={m.id} value={m.id} className="bg-[#0B0F17] text-white">
                          Model {m.id} — {m.name} ({m.description})
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Vocal Timbre Selection */}
                  <div className="space-y-2">
                    <label className="block text-xs font-medium text-slate-300">
                      Karakter Vokal (Voice)
                    </label>
                    <div className="grid grid-cols-4 gap-1.5 p-1 bg-[#0B0F17] border border-slate-800 rounded-lg">
                      {(['auto', 'male', 'female', 'random'] as const).map((v) => (
                        <button
                          key={v}
                          type="button"
                          disabled={isGenerating || instrumental}
                          onClick={() => setSelectedVoice(v)}
                          className={`py-1.5 px-2 text-xs font-medium rounded-md capitalize transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                            instrumental
                              ? 'opacity-40 cursor-not-allowed text-slate-500'
                              : selectedVoice === v
                              ? 'bg-slate-800 text-amber-400 font-semibold'
                              : 'text-slate-400 hover:text-white'
                          }`}
                        >
                          {v}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Optional Title, Genre Style & Instrumental Toggle */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <label htmlFor="custom-title" className="block text-xs font-medium text-slate-300">
                      Judul Lagu (Opsional)
                    </label>
                    <input
                      id="custom-title"
                      type="text"
                      value={customTitle}
                      onChange={(e) => setCustomTitle(e.target.value)}
                      placeholder="Otomatis dari AI jika dikosongkan"
                      disabled={isGenerating}
                      className="w-full rounded-lg bg-[#0B0F17] border border-slate-800 px-3.5 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 transition-colors"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label htmlFor="custom-style" className="block text-xs font-medium text-slate-300">
                      Gaya Musik / Genre Tags (Opsional)
                    </label>
                    <input
                      id="custom-style"
                      type="text"
                      value={customStyle}
                      onChange={(e) => setCustomStyle(e.target.value)}
                      placeholder="Misal: indie rock, acoustic, city pop"
                      disabled={isGenerating}
                      className="w-full rounded-lg bg-[#0B0F17] border border-slate-800 px-3.5 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 transition-colors"
                    />
                  </div>
                </div>

                {creationMode === 'lyricsToSong' && (
                  <div className="space-y-1.5">
                    <label htmlFor="exclude-style" className="block text-xs font-medium text-slate-300">
                      Instrumen / Genre yang Dihindari (Opsional)
                    </label>
                    <input
                      id="exclude-style"
                      type="text"
                      value={excludeStyles}
                      onChange={(e) => setExcludeStyles(e.target.value)}
                      placeholder="Misal: heavy metal, screaming, autotune"
                      disabled={isGenerating}
                      className="w-full rounded-lg bg-[#0B0F17] border border-slate-800 px-3.5 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 transition-colors"
                    />
                  </div>
                )}

                {/* Instrumental Switch + Submit Button */}
                <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-t border-slate-800/80">
                  <label className="inline-flex items-center gap-3 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={instrumental}
                      onChange={(e) => setInstrumental(e.target.checked)}
                      disabled={isGenerating}
                      className="sr-only peer"
                    />
                    <div className="w-10 h-5 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all relative peer-checked:bg-amber-500" />
                    <div>
                      <span className="text-xs font-medium text-slate-200 block">
                        Mode Instrumental Murni
                      </span>
                      <span className="text-[11px] text-slate-400 block">
                        Buat musik latar tanpa suara vokal (`instrumental={String(instrumental)}`)
                      </span>
                    </div>
                  </label>

                  <button
                    type="submit"
                    disabled={isGenerating}
                    className="px-6 py-3 rounded-lg bg-amber-500 hover:bg-amber-400 disabled:bg-amber-500/50 text-slate-950 font-semibold text-sm flex items-center justify-center gap-2.5 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                  >
                    {isGenerating ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>Mensintesis Lagu ({elapsedSeconds}d)...</span>
                      </>
                    ) : (
                      <>
                        <Music className="w-4 h-4" />
                        <span>Generate Lagu Sekarang</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Synthesis Progress Banner */}
                {isGenerating && (
                  <div className="rounded-lg bg-[#0B0F17] border border-amber-500/40 p-4 space-y-2.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-medium text-amber-300">{synthesisPhaseText}</span>
                      <span className="font-mono text-slate-400 tabular-nums">
                        {elapsedSeconds}s / ~60–90s
                      </span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-amber-500 transition-all duration-500"
                        style={{ width: `${Math.min(95, Math.max(8, (elapsedSeconds / 85) * 100))}%` }}
                      />
                    </div>
                    <p className="text-[11px] text-slate-400">
                      Zettai API sedang memproses lirik, vokal, dan mastering 2 variasi lagu secara penuh tanpa batas waktu (no-timeout). Mohon tunggu hingga selesai.
                    </p>
                  </div>
                )}

                {/* Error Feedback */}
                {errorMessage && (
                  <div className="rounded-lg bg-red-950/40 border border-red-800/80 p-3.5 flex items-start gap-3 text-xs text-red-200">
                    <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <p className="font-semibold text-red-300">Gagal Memproses Permintaan</p>
                      <p className="mt-0.5 text-red-200/90">{errorMessage}</p>
                      <div className="mt-3 flex flex-wrap items-center gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            setErrorMessage(null);
                            const fakeEvent = { preventDefault: () => {} } as React.FormEvent;
                            handleGenerateMusic(fakeEvent);
                          }}
                          className="px-3 py-1.5 rounded-md bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold text-xs transition-colors cursor-pointer"
                        >
                          Coba Lagi Sekarang
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setErrorMessage(null);
                            setTracks((prev) => {
                              const existingIds = new Set(INITIAL_SHOWCASE_TRACKS.map((t) => t.id));
                              const filtered = prev.filter((p) => !existingIds.has(p.id));
                              const combined = [...INITIAL_SHOWCASE_TRACKS, ...filtered];
                              saveTracksToStorage(combined);
                              return combined;
                            });
                            setSelectedTrackId(INITIAL_SHOWCASE_TRACKS[0].id);
                            setIsPlaying(true);
                            if (audioRef.current) {
                              audioRef.current.src = INITIAL_SHOWCASE_TRACKS[0].audioUrl;
                              audioRef.current.load();
                              audioRef.current.play().catch(() => setIsPlaying(false));
                            }
                          }}
                          className="px-3 py-1.5 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-medium transition-colors cursor-pointer"
                        >
                          Muat Lagu Contoh Studio Master
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </form>
            </div>

            {/* RIGHT COLUMN (5 Cols): Active Track Inspector & Lyrics Viewer */}
            <div className="lg:col-span-5 bg-[#111723] border border-slate-800/90 rounded-xl p-6 flex flex-col justify-between">
              {activeTrack ? (
                <div className="flex flex-col h-full justify-between space-y-5">
                  {/* Top Track Header */}
                  <div className="flex items-start gap-4">
                    <div className="relative w-24 h-24 rounded-lg overflow-hidden shrink-0 border border-slate-800 group">
                      <CoverArtwork
                        src={activeTrack.imageUrl}
                        alt={activeTrack.title}
                        className="w-full h-full"
                      />
                      <button
                        type="button"
                        onClick={togglePlayPause}
                        aria-label={isPlaying ? 'Pause' : 'Play'}
                        className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                      >
                        {isPlaying ? (
                          <Pause className="w-8 h-8 text-amber-400 fill-amber-400" />
                        ) : (
                          <Play className="w-8 h-8 text-amber-400 fill-amber-400 ml-0.5" />
                        )}
                      </button>
                    </div>

                    <div className="flex-1 min-w-0">
                      {/* Zero-Pill Metadata Discipline: Clean unboxed text with separators */}
                      <div className="flex flex-wrap items-center gap-1.5 text-xs text-amber-400/90 font-mono">
                        <span>{activeTrack.model}</span>
                        <span aria-hidden="true">·</span>
                        <span>{activeTrack.durationFormatted}</span>
                        <span aria-hidden="true">·</span>
                        <span>{activeTrack.instrumental ? 'Instrumental' : `Vocal (${activeTrack.voice || 'auto'})`}</span>
                      </div>

                      <h2 className="text-lg font-bold text-white mt-1 truncate font-display">
                        {activeTrack.title}
                      </h2>

                      <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                        Prompt: <span className="text-slate-200">{activeTrack.prompt}</span>
                      </p>

                      <div className="flex items-center gap-3 mt-3">
                        <button
                          type="button"
                          onClick={togglePlayPause}
                          className="px-3.5 py-1.5 rounded-md bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold text-xs flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                        >
                          {isPlaying ? (
                            <>
                              <Pause className="w-3.5 h-3.5 fill-slate-950" />
                              <span>Jeda Audio</span>
                            </>
                          ) : (
                            <>
                              <Play className="w-3.5 h-3.5 fill-slate-950" />
                              <span>Putar Master</span>
                            </>
                          )}
                        </button>

                        <a
                          href={activeTrack.audioUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          download={`${activeTrack.title}.mp3`}
                          className="px-3 py-1.5 rounded-md bg-[#0B0F17] hover:bg-slate-800 text-slate-200 border border-slate-800 text-xs font-medium flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>Unduh MP3</span>
                        </a>
                      </div>
                    </div>
                  </div>

                  {/* Musical Arrangement & Production Style */}
                  <div className="border-t border-b border-slate-800/80 py-3">
                    <div className="text-[11px] font-medium text-slate-400 mb-1">
                      Aransemen & Karakter Produksi
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed line-clamp-2">
                      {activeTrack.style}
                    </p>
                  </div>

                  {/* Synchronized Lyrics Sheet */}
                  <div className="flex-1 flex flex-col min-h-0">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
                        <FileText className="w-3.5 h-3.5 text-amber-400" />
                        <span>Lembar Lirik & Struktur Lagu</span>
                      </span>
                      {activeTrack.lyrics && (
                        <button
                          type="button"
                          onClick={handleCopyLyrics}
                          className="text-xs text-slate-400 hover:text-white flex items-center gap-1 transition-colors cursor-pointer"
                        >
                          {copiedLyrics ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-emerald-400" />
                              <span className="text-emerald-400">Tersalin</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5" />
                              <span>Salin Lirik</span>
                            </>
                          )}
                        </button>
                      )}
                    </div>

                    <div className="bg-[#0B0F17] border border-slate-800/90 rounded-lg p-4 h-64 overflow-y-auto font-sans text-xs leading-relaxed text-slate-200 whitespace-pre-wrap">
                      {activeTrack.lyrics ? (
                        activeTrack.lyrics
                      ) : (
                        <span className="text-slate-500 italic">
                          Trek instrumental murni — tidak ada lirik vokal pada rekaman ini.
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center py-12">
                  <Disc className="w-10 h-10 text-slate-600 mb-3" />
                  <p className="text-sm font-medium text-slate-300">Belum Ada Lagu yang Dipilih</p>
                  <p className="text-xs text-slate-500 max-w-xs mt-1">
                    Pilih lagu dari daftar di bawah atau buat lagu baru menggunakan formulir di sebelah kiri.
                  </p>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* SECTION 2: Generated Track Library (High-Density Studio Table + Filter Controls) */}
        <section ref={libraryRef} id="library" className="scroll-mt-24 space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
            <div>
              <h2 className="text-xl font-bold text-white font-display">
                Koleksi Master Lagu ({filteredTracks.length})
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Daftar hasil sintesis dari endpoint Zettai Music API lengkap dengan variasi Take A & Take B
              </p>
            </div>

            {/* Search & Interactive Filter Controls */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Cari judul, lirik, genre..."
                  className="bg-[#111723] border border-slate-800 rounded-lg pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 w-52"
                />
              </div>

              <div className="flex items-center gap-1 p-1 bg-[#111723] border border-slate-800 rounded-lg">
                {(['all', 'vocal', 'instrumental'] as const).map((filterType) => (
                  <button
                    key={filterType}
                    type="button"
                    onClick={() => setVocalFilter(filterType)}
                    className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                      vocalFilter === filterType
                        ? 'bg-slate-800 text-white'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {filterType === 'all'
                      ? 'Semua'
                      : filterType === 'vocal'
                      ? 'Vokal'
                      : 'Instrumental'}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {isLoadingInitial ? (
            <div className="space-y-2">
              {[1, 2].map((n) => (
                <div
                  key={n}
                  className="h-16 rounded-lg bg-[#111723] border border-slate-800/70 animate-pulse px-4 flex items-center justify-between"
                >
                  <div className="h-4 w-48 bg-slate-800 rounded" />
                  <div className="h-4 w-24 bg-slate-800 rounded" />
                </div>
              ))}
            </div>
          ) : filteredTracks.length === 0 ? (
            <div className="bg-[#111723] border border-slate-800/90 rounded-xl p-10 text-center space-y-3">
              <p className="text-sm font-medium text-slate-200">
                Tidak ada lagu yang cocok dengan pencarian Anda
              </p>
              <p className="text-xs text-slate-400 max-w-md mx-auto">
                Ubah kata kunci pencarian atau langsung buat lagu baru menggunakan prompt di atas.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setVocalFilter('all');
                }}
                className="px-4 py-2 text-xs font-semibold bg-amber-500 text-slate-950 rounded-lg hover:bg-amber-400 transition-colors cursor-pointer"
              >
                Reset Filter
              </button>
            </div>
          ) : (
            <div className="bg-[#111723] border border-slate-800/90 rounded-xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-800/90 text-[11px] font-medium text-slate-400 bg-[#0B0F17]/60">
                      <th className="py-3 pl-4 pr-2 w-12">#</th>
                      <th className="py-3 px-3">Judul & Prompt Lagu</th>
                      <th className="py-3 px-3 hidden md:table-cell">Gaya Aransemen</th>
                      <th className="py-3 px-3">Spesifikasi</th>
                      <th className="py-3 px-3 text-right font-mono">Durasi</th>
                      <th className="py-3 pl-3 pr-4 text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/70 text-sm">
                    {filteredTracks.map((track, idx) => {
                      const isCurrent = track.id === activeTrack?.id;
                      const isCurrentPlaying = isCurrent && isPlaying;
                      return (
                        <tr
                          key={track.id}
                          onClick={() => selectAndPlayTrack(track)}
                          className={`group transition-colors cursor-pointer ${
                            isCurrent ? 'bg-amber-500/10' : 'hover:bg-slate-800/40'
                          }`}
                        >
                          <td className="py-3 pl-4 pr-2 font-mono text-xs text-slate-400 tabular-nums">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                selectAndPlayTrack(track);
                              }}
                              aria-label={isCurrentPlaying ? 'Pause' : 'Play'}
                              className="w-7 h-7 rounded-md flex items-center justify-center bg-[#0B0F17] border border-slate-800 group-hover:border-amber-500/60 text-slate-200 cursor-pointer"
                            >
                              {isCurrentPlaying ? (
                                <Pause className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                              ) : (
                                <Play className="w-3.5 h-3.5 text-slate-300 group-hover:text-amber-400 ml-0.5" />
                              )}
                            </button>
                          </td>

                          <td className="py-3 px-3">
                            <div className="flex items-center gap-3">
                              <CoverArtwork
                                src={track.imageUrl}
                                alt={track.title}
                                className="w-10 h-10 rounded-md shrink-0 border border-slate-800"
                              />
                              <div className="min-w-0">
                                <div className="font-semibold text-white truncate flex items-center gap-2">
                                  <span className={isCurrent ? 'text-amber-400' : 'text-white'}>
                                    {track.title}
                                  </span>
                                </div>
                                <div className="text-xs text-slate-400 truncate max-w-xs sm:max-w-md">
                                  Prompt: {track.prompt}
                                  {track.variationLabel ? ` · ${track.variationLabel}` : ''}
                                </div>
                              </div>
                            </div>
                          </td>

                          <td className="py-3 px-3 hidden md:table-cell max-w-xs">
                            <p className="text-xs text-slate-300 truncate">{track.style}</p>
                          </td>

                          <td className="py-3 px-3 whitespace-nowrap">
                            {/* Zero-Pill Metadata Discipline */}
                            <div className="text-xs text-slate-300 font-mono">
                              <span>{track.model}</span>
                              <span className="mx-1.5 text-slate-600">·</span>
                              <span>{track.instrumental ? 'Instrumental' : `Vocal (${track.voice || 'auto'})`}</span>
                            </div>
                          </td>

                          <td className="py-3 px-3 text-right font-mono text-xs text-slate-300 tabular-nums whitespace-nowrap">
                            {track.durationFormatted}
                          </td>

                          <td
                            className="py-3 pl-3 pr-4 text-right whitespace-nowrap"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <div className="inline-flex items-center gap-2">
                              <a
                                href={track.audioUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                download={`${track.title}.mp3`}
                                className="px-2.5 py-1 rounded bg-[#0B0F17] hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 text-xs font-medium inline-flex items-center gap-1 transition-colors"
                              >
                                <Download className="w-3 h-3" />
                                <span>MP3</span>
                              </a>
                              {tracks.length > 1 && (
                                <button
                                  type="button"
                                  onClick={() => handleDeleteTrack(track.id)}
                                  title="Hapus dari daftar"
                                  className="p-1.5 rounded bg-[#0B0F17] hover:bg-red-950/60 text-slate-400 hover:text-red-300 border border-slate-800 transition-colors cursor-pointer"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </section>

        {/* SECTION 3: Curated Indonesian Prompt Presets */}
        <section ref={presetsRef} id="presets" className="scroll-mt-24 space-y-5">
          <div className="border-b border-slate-800/80 pb-4">
            <h2 className="text-xl font-bold text-white font-display">
              Inspirasi Prompt & Template Aransemen
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Klik salah satu template di bawah untuk memuat parameter ke Synthesis Studio
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {PRESET_PROMPTS.map((preset, index) => (
              <div
                key={preset.id}
                className="bg-[#111723] border border-slate-800/90 hover:border-slate-700 rounded-xl p-5 flex flex-col justify-between transition-colors"
              >
                <div className="space-y-2.5">
                  <div className="text-xs font-mono text-amber-400/90">
                    0{index + 1}. {preset.category} · Model {preset.model}
                  </div>
                  <h3 className="text-base font-bold text-white font-display leading-snug">
                    {preset.label}
                  </h3>
                  <p className="text-xs text-slate-300 line-clamp-2">
                    “{preset.prompt}”
                  </p>
                  <p className="text-[11px] text-slate-400 font-mono">
                    Style: {preset.style}
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-slate-800/80 flex items-center justify-between">
                  <span className="text-[11px] font-mono text-slate-400">
                    Voice: {preset.instrumental ? 'Instrumental' : preset.voice}
                  </span>
                  <button
                    type="button"
                    onClick={() => applyPreset(preset)}
                    className="text-xs font-semibold text-amber-400 hover:text-amber-300 inline-flex items-center gap-1 transition-colors cursor-pointer"
                  >
                    <span>Gunakan Prompt</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* SECTION 4: Live Zettai API Endpoint & Node.js Integration Inspector */}
        <section ref={apiRef} id="api" className="scroll-mt-24 space-y-5">
          <div className="border-b border-slate-800/80 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-bold text-white font-display">
                Spesifikasi Endpoint Zettai API & Integrasi Node.js
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                URL endpoint dinamis yang disinkronkan secara otomatis dengan parameter studio Anda saat ini
              </p>
            </div>
            <button
              type="button"
              onClick={handleCopyEndpoint}
              className="px-3.5 py-2 rounded-lg bg-[#111723] hover:bg-slate-800 border border-slate-800 text-xs font-medium text-slate-200 flex items-center gap-2 self-start transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              {copiedEndpoint ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">URL Endpoint Tersalin</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Salin URL Endpoint</span>
                </>
              )}
            </button>
          </div>

          <div className="bg-[#111723] border border-slate-800/90 rounded-xl p-6 space-y-5">
            <div className="space-y-2">
              <div className="text-xs font-mono text-slate-400">
                GET Request URL (Real-Time Parameter Sync)
              </div>
              <div className="bg-[#0B0F17] border border-slate-800 rounded-lg p-3.5 font-mono text-xs text-amber-300 break-all select-all">
                {liveEndpointPreview}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-2 border-t border-slate-800/80 text-xs">
              <div>
                <span className="text-slate-400 block">Parameter `prompt`</span>
                <span className="font-mono text-white mt-0.5 block truncate">
                  {prompt || 'seporsi mie ayam sebelum mati'}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block">Parameter `model`</span>
                <span className="font-mono text-white mt-0.5 block tabular-nums">
                  {selectedModel} (AISongMaker V{selectedModel === 5 ? '4' : selectedModel})
                </span>
              </div>
              <div>
                <span className="text-slate-400 block">Parameter `voice`</span>
                <span className="font-mono text-white mt-0.5 block">
                  {selectedVoice}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block">Parameter `instrumental`</span>
                <span className="font-mono text-white mt-0.5 block">
                  {String(instrumental)}
                </span>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Bottom Sticky Master Audio Transport Bar */}
      {activeTrack && (
        <div className="fixed bottom-0 inset-x-0 z-40 bg-[#0B0F17]/95 backdrop-blur-md border-t border-slate-800 px-4 sm:px-6 py-3">
          <div className="max-w-[1380px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
            {/* Track Identity */}
            <div className="flex items-center gap-3 w-full sm:w-1/4 min-w-0">
              <CoverArtwork
                src={activeTrack.imageUrl}
                alt={activeTrack.title}
                className="w-11 h-11 rounded-md shrink-0 border border-slate-800"
              />
              <div className="min-w-0 flex-1">
                <div className="text-xs font-semibold text-white truncate">
                  {activeTrack.title}
                </div>
                <div className="text-[11px] text-slate-400 truncate font-mono">
                  {activeTrack.model} · {activeTrack.prompt}
                </div>
              </div>
            </div>

            {/* Playback Controls & Scrubber */}
            <div className="flex flex-col items-center w-full sm:w-2/4 max-w-xl gap-1.5">
              <div className="flex items-center gap-5">
                <button
                  type="button"
                  onClick={() => handleSkip('prev')}
                  aria-label="Lagu Sebelumnya"
                  className="text-slate-400 hover:text-white transition-colors cursor-pointer"
                >
                  <SkipBack className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={togglePlayPause}
                  aria-label={isPlaying ? 'Jeda' : 'Putar'}
                  className="w-9 h-9 rounded-full bg-amber-500 hover:bg-amber-400 text-slate-950 flex items-center justify-center transition-colors cursor-pointer"
                >
                  {isPlaying ? (
                    <Pause className="w-4 h-4 fill-slate-950" />
                  ) : (
                    <Play className="w-4 h-4 fill-slate-950 ml-0.5" />
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => handleSkip('next')}
                  aria-label="Lagu Berikutnya"
                  className="text-slate-400 hover:text-white transition-colors cursor-pointer"
                >
                  <SkipForward className="w-4 h-4" />
                </button>
              </div>

              <div className="w-full flex items-center gap-3 text-[11px] font-mono text-slate-400 tabular-nums">
                <span className="w-9 text-right">{formatSeconds(currentTime)}</span>
                <input
                  type="range"
                  min={0}
                  max={duration || activeTrack.duration || 160}
                  step={0.1}
                  value={currentTime}
                  onChange={handleSeek}
                  className="flex-1 h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
                />
                <span className="w-9">{formatSeconds(duration || activeTrack.duration)}</span>
              </div>
            </div>

            {/* Volume & Direct Download */}
            <div className="hidden sm:flex items-center justify-end gap-3 w-1/4">
              <button
                type="button"
                onClick={() => setIsMuted(!isMuted)}
                aria-label="Toggle Mute"
                className="text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                {isMuted || volume === 0 ? (
                  <VolumeX className="w-4 h-4" />
                ) : (
                  <Volume2 className="w-4 h-4" />
                )}
              </button>
              <input
                type="range"
                min={0}
                max={1}
                step={0.02}
                value={isMuted ? 0 : volume}
                onChange={(e) => {
                  setVolume(Number(e.target.value));
                  setIsMuted(false);
                }}
                aria-label="Volume"
                className="w-20 h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
              />
              <a
                href={activeTrack.audioUrl}
                target="_blank"
                rel="noopener noreferrer"
                download={`${activeTrack.title}.mp3`}
                className="ml-2 px-3 py-1.5 rounded-md bg-[#111723] hover:bg-slate-800 text-xs font-medium text-slate-200 border border-slate-800 flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Unduh</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
