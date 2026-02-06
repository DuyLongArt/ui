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

            <div className="relative z-10 max-w-7xl mx-auto h-full flex flex-col lg:flex-row gap-6 md:gap-10">

                {/* Fixed Sidebar Library - Glassy & Flat */}
                <div className="w-full lg:w-[380px] xl:w-[420px] flex flex-col gap-6 md:gap-8 h-auto lg:h-[82vh]">
                    <div className="space-y-4 md:space-y-6">
                        <div className="flex items-center justify-between">
                            <h1 className="text-3xl md:text-4xl font-black tracking-tight bg-linear-to-r from-white to-white/50 bg-clip-text text-transparent">Library</h1>
                            <div className="flex gap-1 md:gap-2">
                                <button onClick={() => setViewMode('list')} className={`p-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-white/10 text-white' : 'text-slate-500 hover:text-slate-300'}`}><List size={16} className="md:w-[18px] md:h-[18px]" /></button>
                                <button onClick={() => setViewMode('grid')} className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-white/10 text-white' : 'text-slate-500 hover:text-slate-300'}`}><LayoutGrid size={16} className="md:w-[18px] md:h-[18px]" /></button>
                            </div>
                        </div>

                        <div className="relative">
                            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                            <input
                                type="text"
                                placeholder="Search tracks..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full bg-white/5 border border-white/10 rounded-2xl pl-11 pr-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-white/20 transition-all backdrop-blur-xl placeholder:text-slate-600"
                            />
                        </div>
                    </div>

                    <div className="h-[30vh] md:h-[40vh] lg:h-full overflow-y-auto pr-2 custom-scrollbar space-y-2 md:space-y-3">
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
                                        className={`group flex items-center p-2 md:p-3 rounded-xl md:rounded-2xl cursor-pointer transition-all duration-300 ${currentSong?.id === song.id ? 'bg-white/10 border-white/20' : 'hover:bg-white/5 border-transparent'} border`}
                                    >
                                        <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg md:rounded-xl bg-slate-800/50 flex-none mr-3 md:mr-4 overflow-hidden relative border border-white/5">
                                            {song.coverUrl ? (
                                                <img src={song.coverUrl} className="w-full h-full object-cover" alt="" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center bg-linear-to-br from-indigo-900/40 to-black/40"><MusicIcon size={14} className="md:w-[18px] md:h-[18px] text-indigo-400/60" /></div>
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h3 className={`text-xs md:text-sm font-bold truncate ${currentSong?.id === song.id ? 'text-white' : 'text-slate-300'}`}>{song.title}</h3>
                                            <p className="text-[10px] md:text-[11px] font-medium text-slate-500 uppercase tracking-wider">{song.artist || 'Unknown'}</p>
                                        </div>
                                        {currentSong?.id === song.id && isPlaying && (
                                            <div className="flex gap-0.5 md:gap-1 items-end h-2 md:h-3 px-1 md:px-2">
                                                <motion.div animate={{ height: [3, 8, 4, 8] }} transition={{ repeat: Infinity, duration: 0.6 }} className="w-[1.5px] md:w-[2px] bg-indigo-400 rounded-full" />
                                                <motion.div animate={{ height: [6, 3, 8, 6] }} transition={{ repeat: Infinity, duration: 0.8 }} className="w-[1.5px] md:w-[2px] bg-indigo-400 rounded-full" />
                                                <motion.div animate={{ height: [8, 6, 3, 8] }} transition={{ repeat: Infinity, duration: 0.7 }} className="w-[1.5px] md:w-[2px] bg-indigo-400 rounded-full" />
                                            </div>
                                        )}
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        )}
                    </div>
                </div>

                {/* Main Glassy Card Player */}
                <div className="flex-1 w-full overflow-hidden">
                    <LiquidGlassCard
                        containerClassName="h-full w-full"
                        className="min-h-[500px] lg:h-[82vh] flex flex-col p-6 md:p-10 lg:p-12 transition-all"
                        blobColor="bg-indigo-600/30"
                    >
                        {!currentSong ? (
                            <div className="flex-1 flex flex-col items-center justify-center text-center opacity-40 px-4" >
                                <MusicIcon size={60} strokeWidth={1} className="md:w-20 md:h-20 mb-4 md:mb-6" />
                                <h2 className="text-2xl md:text-3xl font-light tracking-[0.2em] uppercase">Standby</h2>
                                <p className="text-[10px] md:text-xs font-bold mt-3 md:mt-4 uppercase tracking-widest text-indigo-400">Initialize signal to start</p>
                            </div>
                        ) : (
                            <div className="h-full flex flex-col justify-between">
                                {/* Top Controls - Flat & Minimal */}
                                <div className="flex justify-between items-center mb-6 md:mb-10">
                                    <div className="flex items-center gap-2 md:gap-3">
                                        <div className={`w-1.5 h-1.5 rounded-full ${isPlaying ? 'bg-green-500 shadow-[0_0_10px_#22c55e]' : 'bg-slate-700'}`} />
                                        <span className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] md:tracking-[0.3em] text-slate-400">{isPlaying ? 'Live Stream' : 'Signal Halted'}</span>
                                    </div>
                                    <div className="flex gap-3 md:gap-4">
                                        <button className="text-slate-500 hover:text-white transition-colors"><Heart size={16} className="md:w-[18px] md:h-[18px]" /></button>
                                        <button className="text-slate-500 hover:text-white transition-colors"><MoreHorizontal size={16} className="md:w-[18px] md:h-[18px]" /></button>
                                    </div>
                                </div>

                                {/* Main Art & Info */}
                                <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12 mb-8 md:mb-12 max-[410px]:hidden">
                                    <div className="relative w-48 h-48 sm:w-56 sm:h-56 md:w-60 md:h-60 flex-none">
                                        <motion.div
                                            key={currentSong.id}
                                            initial={{ scale: 0.9, opacity: 0 }}
                                            animate={{ scale: 1, opacity: 1 }}
                                            className="w-full h-full rounded-4xl md:rounded-5xl overflow-hidden shadow-[0_30px_60px_-10px_rgba(0,0,0,0.5)] md:shadow-[0_40px_80px_-15px_rgba(0,0,0,0.6)] border border-white/10 relative group"
                                        >
                                            
                                            {currentSong.coverUrl ? (
                                                <img
                                                    src={currentSong.coverUrl}
                                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                                    alt="Cover Art"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center bg-linear-to-br from-indigo-950/50 to-slate-950/50">
                                                    <MusicIcon size={48} className="md:w-20 md:h-20" strokeWidth={1} />
                                                </div>
                                            )}
                                            <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                        </motion.div>
                                        {/* Shadow Blob Behind Art */}
                                        <div className="absolute left-1/2 -translate-x-1/2 w-[80%] h-12 md:h-16 bg-indigo-500/20 blur-2xl md:blur-3xl rounded-full -z-10" />
                                    </div>

                                    <div className="flex-1 text-center md:text-left min-w-0">
                                        <motion.div
                                            key={currentSong.id}
                                            initial={{ y: 20, opacity: 0 }}
                                            animate={{ y: 0, opacity: 1 }}
                                            transition={{ duration: 0.5 }}
                                            className="space-y-4 md:space-y-6"
                                        >
                                            <div>
                                                <h3 className="text-xl md:text-2xl lg:text-3xl font-black tracking-tighter leading-tight truncate">{currentSong.title}</h3>
                                                <p className="text-indigo-400 font-bold text-sm md:text-md uppercase tracking-[0.15em] md:tracking-[0.2em] mt-1">{currentSong.artist || 'Unknown Artist'}</p>
                                            </div>

                                            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 md:gap-6">
                                                <div className="flex items-center gap-2 bg-white/5 py-1 px-3 md:py-1.5 md:px-4 rounded-full border border-white/10">
                                                    <div className="h-1 w-1 bg-white/40 rounded-full" />
                                                    <span className="text-[9px] md:text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">ALBUM: {currentSong.album || 'SINGLE'}</span>
                                                </div>
                                                <div className="flex items-center gap-2 bg-white/5 py-1 px-3 md:py-1.5 md:px-4 rounded-full border border-white/10">
                                                    <div className="h-1 w-1 bg-white/40 rounded-full" />
                                                    <span className="text-[9px] md:text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">FORMAT: 320KBPS</span>
                                                </div>
                                            </div>
                                        </motion.div>
                                    </div>
                                </div>

                                {/* Controls & Progress */}
                                <div className="space-y-6 md:space-y-10">
                                    <div className="space-y-3 md:space-y-4">
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
                                        <div className="flex justify-between text-[10px] md:text-[11px] font-mono font-bold text-slate-500 px-1">
                                            <span className="text-white/80">{formatTime(currentTime)}</span>
                                            <span>{formatTime(duration)}</span>
                                        </div>
                                    </div>

                                    <div className="flex flex-col sm:flex-row items-center justify-between gap-6 md:gap-0">
                                        <div className="flex gap-6 order-2 sm:order-1">
                                            <button className="text-slate-500 hover:text-white transition-colors"><Shuffle size={18} className="md:w-5 md:h-5" /></button>
                                            <button className="text-slate-500 hover:text-white transition-colors"><Repeat size={18} className="md:w-5 md:h-5" /></button>
                                        </div>

                                        <div className="flex items-center gap-6 md:gap-10 order-1 sm:order-2">
                                            <button
                                                onClick={playPrev}
                                                className="w-10 h-10 md:w-12 md:h-12 text-white flex items-center justify-center rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 hover:border-white/20 transition-all text-slate-300 hover:text-white active:scale-90"
                                            >
                                                <SkipBack size={20} className="md:w-6 md:h-6" fill="currentColor" />
                                            </button>

                                            <motion.button
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                                onClick={() => setIsPlaying(!isPlaying)}
                                                className="w-16 h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 rounded-2xl md:rounded-3xl bg-white text-white flex items-center justify-center shadow-[0_15px_40px_rgba(255,255,255,0.1)] md:shadow-[0_20px_50px_rgba(255,255,255,0.15)] transition-all"
                                            >
                                                {isPlaying ? <Pause size={28} className="md:w-32 lg:w-[38px]" fill="currentColor" /> : <Play size={28} className="md:w-32 lg:w-[38px] ml-1" fill="currentColor" />}
                                            </motion.button>

                                            <button
                                                onClick={playNext}
                                                className="w-10 h-10 md:w-12 md:h-12 text-white flex items-center justify-center rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 hover:border-white/20 transition-all text-slate-300 hover:text-white active:scale-90"
                                            >
                                                <SkipForward size={20} className="md:w-6 md:h-6" fill="currentColor" />
                                            </button>
                                        </div>

                                        <div className="flex items-center gap-3 md:gap-5 w-full sm:w-40 lg:w-48 order-3">
                                            <button onClick={() => setIsMuted(!isMuted)} className="text-slate-500 hover:text-white transition-colors">{isMuted || volume === 0 ? <VolumeX size={18} className="md:w-5 md:h-5" /> : <Volume2 size={18} className="md:w-5 md:h-5" />}</button>
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
