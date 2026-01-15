import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, SkipBack, SkipForward, Disc, Music as MusicIcon, Volume2, Search, Heart, Share2 } from 'lucide-react';
import { useMusicStore } from '../../../../OrchestraLayer/StateManager/Zustand/musicStore';

/**
 * MusicPage Component
 * 
 * Displays a music library and a player interface.
 * Utilizes global music state for playback controls.
 */
const MusicPage = () => {
    const { playlist, currentSong, isLoading, error, fetchPlaylist, setCurrentSong, isPlaying, setIsPlaying, playNext, playPrev } = useMusicStore();

    const togglePlay = () => {
        setIsPlaying(!isPlaying);
    };

    useEffect(() => {
        fetchPlaylist();
    }, []);

    return (
        <div className="min-h-screen bg-linear-to-br from-indigo-900 via-purple-900 to-black text-white p-6 md:p-12 overflow-hidden relative">

            {/* Ambient Background */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] right-[-10%] w-[50vh] h-[50vh] bg-purple-600/30 rounded-full blur-[100px]" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[50vh] h-[50vh] bg-indigo-600/30 rounded-full blur-[100px]" />
            </div>

            <div className="relative z-10 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 lg:h-[85vh]">

                {/* Playlist Section */}
                <div className="lg:col-span-7 flex flex-col gap-6 h-[50vh] lg:h-full">
                    {/* Header */}
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-4xl font-black tracking-tight mb-1">Library</h1>
                            <p className="text-white text-sm font-medium">Your personal collection</p>
                        </div>
                        <div className="bg-white/10 p-3 rounded-full backdrop-blur-md">
                            <Search size={20} className="text-white/70" />
                        </div>
                    </div>

                    {/* Song List */}
                    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-4 overflow-y-auto flex-1 shadow-2xl custom-scrollbar">
                        {isLoading ? (
                            <div className="flex items-center justify-center h-full">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
                            </div>
                        ) : error ? (
                            <div className="text-red-400 text-center p-8">
                                <p>Error loading music.</p>
                                <p className="text-xs mt-2 opacity-70">{error}</p>
                            </div>
                        ) : (
                            <div className="space-y-2">
                                {Array.isArray(playlist) && playlist.map((song, index) => (
                                    <motion.div
                                        key={song.id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.05 }}
                                        onClick={() => {
                                            setCurrentSong(song);
                                        }}
                                        className={`group flex items-center p-3 rounded-2xl cursor-pointer transition-all duration-200 ${currentSong?.id === song.id
                                            ? 'bg-white/20 shadow-lg border border-white/20'
                                            : 'hover:bg-white/10 border border-transparent'
                                            }`}
                                    >
                                        <div className="relative w-12 h-12 rounded-xl overflow-hidden mr-4 shadow-md">
                                            {song.coverUrl ? (
                                                <img src={song.coverUrl} className="w-full h-full object-cover" alt="cover" />
                                            ) : (
                                                <div className="w-full h-full bg-indigo-500/50 flex items-center justify-center">
                                                    <MusicIcon size={20} />
                                                </div>
                                            )}
                                            {currentSong?.id === song.id && isPlaying && (
                                                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                                                    <motion.div
                                                        animate={{ scale: [1, 1.2, 1] }}
                                                        transition={{ repeat: Infinity, duration: 1.5 }}
                                                    >
                                                        <Volume2 size={16} className="text-white" />
                                                    </motion.div>
                                                </div>
                                            )}
                                        </div>

                                        <div className="flex-1 min-w-0">
                                            <h3 className={`font-bold text-base truncate ${currentSong?.id === song.id ? 'text-white' : 'text-white'}`}>
                                                {song.title}
                                            </h3>
                                            <p className="text-xs text-white truncate">{song.artist}</p>
                                        </div>

                                        <div className="text-xs text-white font-mono pl-4">
                                            3:45
                                        </div>

                                        <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-2 ml-4">
                                            <button className="p-1.5 hover:bg-white/20 rounded-full"><Heart size={14} /></button>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Player Section */}
                <div className="lg:col-span-5 h-[60vh] lg:h-full flex flex-col">
                    <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] p-8 shadow-2xl h-full flex flex-col justify-between relative overflow-hidden">

                        {/* Default State */}
                        {!currentSong && (
                            <div className="flex-1 flex flex-col items-center justify-center text-center opacity-50">
                                <Disc size={64} className="mb-4 text-white" />
                                <p>Select a song to play</p>
                            </div>
                        )}

                        {/* Active State */}
                        {currentSong && (
                            <>
                                {/* Album Art */}
                                <div className="aspect-square w-full rounded-4xl overflow-hidden shadow-2xl relative mb-8 group">
                                    {currentSong.coverUrl ? (
                                        <motion.img
                                            key={currentSong.id}
                                            src={currentSong.coverUrl}
                                            alt="Cover"
                                            className="w-full h-full object-cover"
                                            initial={{ scale: 1.05, opacity: 0 }}
                                            animate={{ scale: 1, opacity: 1 }}
                                            transition={{ duration: 0.5 }}
                                        />
                                    ) : (
                                        <div className="w-full h-full bg-linear-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                                            <MusicIcon size={64} />
                                        </div>
                                    )}
                                    <div className="absolute inset-0 bg-linear-to-b from-white/10 to-transparent pointer-events-none" />
                                </div>

                                {/* Info */}
                                <div className="mb-8">
                                    <div className="flex items-center justify-between mb-2">
                                        <h2 className="text-3xl font-black tracking-tight truncate pr-4">{currentSong.title}</h2>
                                        <button className="p-2 rounded-full hover:bg-white/10 transition-colors">
                                            <Heart size={24} className="text-white" />
                                        </button>
                                    </div>
                                    <p className="text-lg text-white font-medium">{currentSong.artist}</p>
                                </div>

                                {/* Progress Bar */}
                                <div className="mb-8 group">
                                    <div className="h-2 bg-white/10 rounded-full overflow-hidden cursor-pointer">
                                        <motion.div
                                            className="h-full bg-white rounded-full relative"
                                            style={{ width: `${0}%` }}
                                        >
                                            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity" />
                                        </motion.div>
                                    </div>
                                    <div className="flex justify-between text-xs text-white mt-2 font-mono">
                                        <span>0:00</span>
                                        <span>3:45</span>
                                    </div>
                                </div>

                                {/* Controls */}
                                <div className="flex items-center justify-between px-4">
                                    <button className="p-3 text-white hover:text-white transition-colors">
                                        <Share2 size={20} />
                                    </button>

                                    <div className="flex items-center gap-6">
                                        <button onClick={playPrev} className="p-4 rounded-full hover:bg-white/10 transition-colors text-white">
                                            <SkipBack size={28} fill="currentColor" />
                                        </button>

                                        <motion.button
                                            onClick={togglePlay}
                                            whileTap={{ scale: 0.9 }}
                                            className="w-20 h-20 rounded-full bg-white text-white flex items-center justify-center shadow-lg hover:scale-105 transition-transform"
                                        >
                                            {isPlaying ? <Pause size={32} fill="currentColor" /> : <Play size={32} fill="currentColor" />}
                                        </motion.button>

                                        <button onClick={playNext} className="p-4 rounded-full hover:bg-white/10 transition-colors text-white">
                                            <SkipForward size={28} fill="currentColor" />
                                        </button>
                                    </div>

                                    <button className="p-3 text-white hover:text-white transition-colors">
                                        <Volume2 size={20} />
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>

            <style>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 6px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: rgba(255, 255, 255, 0.1);
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: rgba(255, 255, 255, 0.2);
                }
            `}</style>
        </div>
    );
};

export default MusicPage;
