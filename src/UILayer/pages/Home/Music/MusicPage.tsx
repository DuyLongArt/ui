import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Play,
    Pause,
    SkipBack,
    SkipForward,
    Music as MusicIcon,
    Volume2,
    Search,
    RotateCw,
    VolumeX,
    LayoutGrid,
    List,
    Heart,
    MoreHorizontal,
    Shuffle,
    Repeat
} from 'lucide-react';
import { useMusicStore } from '../../../../OrchestraLayer/StateManager/Zustand/musicStore';
import LiquidGlassCard from '../../../components/LiquidGlassCard';

/**
 * MusicPage Component
 * 
 * Refined with a minimalist Flat Glass aesthetic.
 * Features: ultra-glassy cards, minimalist layout, and global sync.
 */
const MusicPage = () => {
    const {
        playlist,
        currentSong,
        isLoading,
        error,
        fetchPlaylist,
        setCurrentSong,
        isPlaying,
        setIsPlaying,
        playNext,
        playPrev,
        audioElement,
        volume,
        isMuted,
        setVolume,
        setIsMuted
    } = useMusicStore();

    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [searchQuery, setSearchQuery] = useState('');
    const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');

    useEffect(() => {
        if (!audioElement) return;
        const updateTime = () => setCurrentTime(audioElement.currentTime);
        const updateDuration = () => setDuration(audioElement.duration || 0);
        audioElement.addEventListener('timeupdate', updateTime);
        audioElement.addEventListener('loadedmetadata', updateDuration);
        setCurrentTime(audioElement.currentTime);
        setDuration(audioElement.duration || 0);
        return () => {
            audioElement.removeEventListener('timeupdate', updateTime);
            audioElement.removeEventListener('loadedmetadata', updateDuration);
        };
    }, [audioElement]);

    useEffect(() => {
        if (audioElement) {
            audioElement.volume = isMuted ? 0 : volume;
        }
    }, [audioElement, volume, isMuted]);

    useEffect(() => {
        fetchPlaylist();
    }, [fetchPlaylist]);

    const formatTime = (time: number) => {
        if (isNaN(time)) return "0:00";
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    };

    const progress = (currentTime / duration) * 100 || 0;

    const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = parseFloat(e.target.value);
        if (audioElement && duration) {
            const newTime = (val / 100) * duration;
            audioElement.currentTime = newTime;
            setCurrentTime(newTime);
        }
    };

    const filteredPlaylist = playlist.filter(song =>
        song.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (song.artist && song.artist.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    return (
        <div className="min-h-screen bg-[#0a0a12] text-white p-6 md:p-10 lg:p-14 overflow-hidden relative selection:bg-indigo-500/40">
            {/* Ultra-Modern Ambient Background */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <motion.div
                    animate={{
                        x: [0, 40, -40, 0],
                        y: [0, -40, 40, 0],
                        scale: [1, 1.1, 0.9, 1]
                    }}
                    transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute top-1/4 -right-20 w-[600px] h-[600px] bg-indigo-600/15 rounded-full blur-[140px]"
                />
                <motion.div
                    animate={{
                        x: [0, -30, 30, 0],
                        y: [0, 30, -30, 0],
                        scale: [1.1, 0.9, 1.1, 1]
                    }}
                    transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute bottom-1/4 -left-20 w-[500px] h-[500px] bg-purple-600/15 rounded-full blur-[140px]"
                />
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] mix-blend-overlay" />
            </div>

            <div className="relative z-10 max-w-7xl mx-auto h-full flex flex-col lg:flex-row gap-10">

                {/* Fixed Sidebar Library - Glassy & Flat */}
                <div className="lg:w-[420px] flex flex-col gap-8 h-[50vh] lg:h-[82vh]">
                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <h1 className="text-4xl font-black tracking-tight bg-linear-to-r from-white to-white/50 bg-clip-text text-transparent">Library</h1>
                            <div className="flex gap-2">
                                <button onClick={() => setViewMode('list')} className={`p-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-white/10 text-white' : 'text-slate-500 hover:text-slate-300'}`}><List size={18} /></button>
                                <button onClick={() => setViewMode('grid')} className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-white/10 text-white' : 'text-slate-500 hover:text-slate-300'}`}><LayoutGrid size={18} /></button>
                            </div>
                        </div>

                        <div className="relative">
                            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                            <input
                                type="text"
                                placeholder="Search tracks..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 py-3.5 text-sm focus:outline-none focus:ring-1 focus:ring-white/20 transition-all backdrop-blur-xl placeholder:text-slate-600"
                            />
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-3">
                        {isLoading ? (
                            <div className="h-40 flex items-center justify-center"><RotateCw className="animate-spin text-indigo-400" /></div>
                        ) : (
                            <AnimatePresence mode="popLayout">
                                {filteredPlaylist.map((song, idx) => (
                                    <motion.div
                                        key={song.id}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: idx * 0.02 }}
                                        onClick={() => setCurrentSong(song)}
                                        className={`group flex items-center p-3 rounded-2xl cursor-pointer transition-all duration-300 ${currentSong?.id === song.id ? 'bg-white/10 border-white/20' : 'hover:bg-white/5 border-transparent'} border`}
                                    >
                                        <div className="w-12 h-12 rounded-xl bg-slate-800/50 flex-none mr-4 overflow-hidden relative border border-white/5">
                                            {song.coverUrl ? (
                                                <img src={song.coverUrl} className="w-full h-full object-cover" alt="" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center bg-linear-to-br from-indigo-900/40 to-black/40"><MusicIcon size={18} className="text-indigo-400/60" /></div>
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h3 className={`text-sm font-bold truncate ${currentSong?.id === song.id ? 'text-white' : 'text-slate-300'}`}>{song.title}</h3>
                                            <p className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">{song.artist || 'Unknown'}</p>
                                        </div>
                                        {currentSong?.id === song.id && isPlaying && (
                                            <div className="flex gap-1 items-end h-3 px-2">
                                                <motion.div animate={{ height: [4, 12, 6, 12] }} transition={{ repeat: Infinity, duration: 0.6 }} className="w-[2px] bg-indigo-400 rounded-full" />
                                                <motion.div animate={{ height: [8, 4, 12, 8] }} transition={{ repeat: Infinity, duration: 0.8 }} className="w-[2px] bg-indigo-400 rounded-full" />
                                                <motion.div animate={{ height: [12, 8, 4, 12] }} transition={{ repeat: Infinity, duration: 0.7 }} className="w-[2px] bg-indigo-400 rounded-full" />
                                            </div>
                                        )}
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        )}
                    </div>
                </div>

                {/* Main Glassy Card Player */}
                <div className="flex-1">
                    <LiquidGlassCard
                        containerClassName="h-full w-full"
                        className="h-[90vh] flex flex-col p-8 md:p-12"
                        blobColor="bg-indigo-600/30"
                    >
                        {!currentSong ? (
                            <div className="flex-1 flex flex-col items-center justify-center text-center opacity-40">
                                <MusicIcon size={80} strokeWidth={1} className="mb-6" />
                                <h2 className="text-3xl font-light tracking-[0.2em] uppercase">Standby</h2>
                                <p className="text-xs font-bold mt-4 uppercase tracking-widest text-indigo-400">Initialize signal to start</p>
                            </div>
                        ) : (
                            <div className="h-full flex flex-col">
                                {/* Top Controls - Flat & Minimal */}
                                <div className="flex justify-between items-center mb-10">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-1.5 h-1.5 rounded-full ${isPlaying ? 'bg-green-500 shadow-[0_0_10px_#22c55e]' : 'bg-slate-700'}`} />
                                        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">{isPlaying ? 'Live Stream' : 'Signal Halted'}</span>
                                    </div>
                                    <div className="flex gap-4">
                                        <button className="text-slate-500 hover:text-white transition-colors"><Heart size={18} /></button>
                                        <button className="text-slate-500 hover:text-white transition-colors"><MoreHorizontal size={18} /></button>
                                    </div>
                                </div>

                                {/* Main Art & Info - Apple Music Style Flat Glass */}
                                <div className="flex  flex-col md:flex-row items-center gap-12 mb-5">
                                    <div className="relative w-full max-w-[340px]  aspect-square flex-none">
                                        <motion.div
                                            key={currentSong.id}
                                            initial={{ scale: 0.9, opacity: 0 }}
                                            animate={{ scale: 1, opacity: 1 }}
                                            className="w-full h-full rounded-[2.5rem] overflow-hidden shadow-[0_40px_80px_-15px_rgba(0,0,0,0.6)] border border-white/10 relative group"
                                        >
                                            {currentSong.coverUrl ? (
                                                <img src={currentSong.coverUrl} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt="" />
                                            ) : (
                                                <div className="w-full h-full bg-linear-to-br from-indigo-600/20 to-purple-600/20 flex items-center justify-center ">
                                                    <MusicIcon size={120} strokeWidth={0.5} className="text-white/10" />
                                                </div>
                                            )}
                                            <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                        </motion.div>
                                        {/* Flat Shadow Blob Behind Art */}
                                        <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-[80%] h-16 bg-indigo-500/20 blur-[60px] rounded-full -z-10" />
                                    </div>

                                    <div className="flex-1 text-center md:text-left">
                                        <motion.div
                                            key={currentSong.id}
                                            initial={{ y: 20, opacity: 0 }}
                                            animate={{ y: 0, opacity: 1 }}
                                            transition={{ duration: 0.5 }}
                                        >
                                            <h3 className="text-2xl font-black tracking-tighter mb-4 leading-tight">{currentSong.title}</h3>
                                            <p className="text-indigo-400 font-bold text-md uppercase tracking-[0.2em] mb-8">{currentSong.artist || 'Unknown Artist'}</p>

                                            <div className="flex flex-wrap items-center justify-center md:justify-start gap-6">
                                                <div className="flex items-center gap-2 bg-white/5 py-1.5 px-4 rounded-full border border-white/10">
                                                    <div className="h-1 w-1 bg-white/40 rounded-full" />
                                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mt-px">ALBUM: {currentSong.album || 'SINGLE'}</span>
                                                </div>
                                                <div className="flex items-center gap-2 bg-white/5 py-1.5 px-4 rounded-full border border-white/10">
                                                    <div className="h-1 w-1 bg-white/40 rounded-full" />
                                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mt-px">FORMAT: 320KBPS</span>
                                                </div>
                                            </div>
                                        </motion.div>
                                    </div>
                                </div>

                                {/* Controls & Progress - Clean Flat Finish */}
                                <div className="space-y-10">
                                    <div className="space-y-4">
                                        <div className="relative h-1 w-full bg-white/10 rounded-full overflow-hidden group/progress">
                                            <motion.div
                                                className="absolute top-0 left-0 h-full bg-indigo-500 shadow-[0_0_15px_#6366f1]"
                                                style={{ width: `${progress}%` }}
                                            />
                                            <input
                                                type="range"
                                                min="0" max="100"
                                                value={progress}
                                                onChange={handleProgressChange}
                                                className="absolute inset-0 w-full opacity-0 cursor-pointer z-10"
                                            />
                                        </div>
                                        <div className="flex justify-between text-[11px] font-mono font-bold text-slate-500 px-1">
                                            <span className="text-white/80">{formatTime(currentTime)}</span>
                                            <span>{formatTime(duration)}</span>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <div className="flex gap-6">
                                            <button className="text-slate-500 hover:text-white transition-colors"><Shuffle size={20} /></button>
                                            <button className="text-slate-500 hover:text-white transition-colors"><Repeat size={20} /></button>
                                        </div>

                                        <div className="flex items-center gap-10">
                                            <button
                                                onClick={playPrev}
                                                className="w-12 h-12 flex items-center justify-center rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 hover:border-white/20 transition-all text-slate-300 hover:text-white active:scale-90"
                                            >
                                                <SkipBack size={24} fill="currentColor" />
                                            </button>

                                            <motion.button
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                                onClick={() => setIsPlaying(!isPlaying)}
                                                className="w-24 h-24 rounded-3xl bg-white text-white flex items-center justify-center shadow-[0_20px_50px_rgba(255,255,255,0.15)] hover:shadow-[0_25px_60px_rgba(255,255,255,0.25)] transition-all"
                                            >
                                                {isPlaying ? <Pause size={38} fill="currentColor" /> : <Play size={38} fill="currentColor" className="ml-1" />}
                                            </motion.button>

                                            <button
                                                onClick={playNext}
                                                className="w-12 h-12 flex items-center justify-center rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 hover:border-white/20 transition-all text-slate-300 hover:text-white active:scale-90"
                                            >
                                                <SkipForward size={24} fill="currentColor" />
                                            </button>
                                        </div>

                                        <div className="flex items-center gap-5 w-48">
                                            <button onClick={() => setIsMuted(!isMuted)} className="text-slate-500 hover:text-white transition-colors">{isMuted || volume === 0 ? <VolumeX size={20} /> : <Volume2 size={20} />}</button>
                                            <div className="flex-1 relative h-1 bg-white/10 rounded-full group/volume">
                                                <div
                                                    className="absolute top-0 left-0 h-full bg-white/40 rounded-full group-hover/volume:bg-indigo-400 transition-colors"
                                                    style={{ width: `${volume * 100}%` }}
                                                />
                                                <input
                                                    type="range" min="0" max="1" step="0.01"
                                                    value={volume}
                                                    onChange={(e) => setVolume(parseFloat(e.target.value))}
                                                    className="absolute inset-0 w-full opacity-0 cursor-pointer"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </LiquidGlassCard>
                </div>
            </div>

            <style>{`
                .custom-scrollbar::-webkit-scrollbar { width: 3px; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.08); border-radius: 10px; }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.15); }
            `}</style>
        </div>
    );
};

export default MusicPage;
