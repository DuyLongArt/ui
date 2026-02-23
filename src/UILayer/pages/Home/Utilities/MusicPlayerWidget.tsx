import React, { useEffect, useState } from 'react';
import { useMusicStore } from '../../../../OrchestraLayer/StateManager/Zustand/musicStore';
import { GlassCard } from '../Person/GlassContainer';
import { Play, Pause, SkipForward, SkipBack, Music } from 'lucide-react';
import { Typography } from "@material-tailwind/react";
import { motion } from 'framer-motion';

const MusicPlayerWidget: React.FC = () => {
    const {
        currentSong,
        isPlaying,
        setIsPlaying,
        playNext,
        playPrev,
        audioElement
    } = useMusicStore();

    const [progress, setProgress] = useState(0);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);

    // Sync with audio element
    useEffect(() => {
        if (!audioElement) return;

        const updateProgress = () => {
            setCurrentTime(audioElement.currentTime);
            setDuration(audioElement.duration || 0);
            if (audioElement.duration) {
                setProgress((audioElement.currentTime / audioElement.duration) * 100);
            }
        };

        audioElement.addEventListener('timeupdate', updateProgress);
        audioElement.addEventListener('loadedmetadata', updateProgress);

        return () => {
            audioElement.removeEventListener('timeupdate', updateProgress);
            audioElement.removeEventListener('loadedmetadata', updateProgress);
        };
    }, [audioElement]);

    const formatTime = (time: number) => {
        if (isNaN(time)) return "0:00";
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    };

    const commonProps = {
        placeholder: undefined,
        onPointerEnterCapture: undefined,
        onPointerLeaveCapture: undefined,
        onResize: undefined,
        onResizeCapture: undefined,
    } as any;

    if (!currentSong) {
        return (
            <GlassCard className="p-6 h-full flex items-center justify-center">
                <div className="flex flex-col items-center text-white/50">
                    <Music size={32} className="mb-2" />
                    <Typography className="text-sm font-bold" {...commonProps}>No Music Playing</Typography>
                </div>
            </GlassCard>
        );
    }

    return (
        <GlassCard className="p-6 relative overflow-hidden group">
            {/* Background Blur Art */}
            {currentSong.coverUrl && (
                <div
                    className="absolute inset-0 bg-cover bg-center opacity-20 blur-xl scale-125 transition-transform duration-1000 group-hover:scale-150"
                    style={{ backgroundImage: `url(${currentSong.coverUrl})` }}
                />
            )}

            <div className="relative z-10 flex flex-col h-full justify-between">
                <div className="flex items-start gap-4 mb-4">
                    <div className="w-16 h-16 rounded-xl bg-slate-800 shadow-lg overflow-hidden shrink-0 border border-white/10">
                        {currentSong.coverUrl ? (
                            <img src={currentSong.coverUrl} alt="Cover" className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center bg-indigo-900/50">
                                <Music size={24} className="text-white/50" />
                            </div>
                        )}
                    </div>
                    <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 mb-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                            <span className="text-[10px] font-black text-green-400 uppercase tracking-widest">NOW PLAYING</span>
                        </div>
                        <Typography variant="h6" className="text-white font-bold truncate leading-tight" {...commonProps}>
                            {currentSong.title}
                        </Typography>
                        <Typography className="text-white/60 text-xs font-medium truncate" {...commonProps}>
                            {currentSong.artist}
                        </Typography>
                    </div>
                </div>

                <div className="space-y-3">
                    {/* Progress Bar */}
                    <div className="space-y-1.5">
                        <div className="flex justify-between text-[10px] font-bold text-white/60 font-mono">
                            <span>{formatTime(currentTime)}</span>
                            <span>{formatTime(duration)}</span>
                        </div>
                        <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                            <motion.div
                                className="h-full bg-indigo-500 rounded-full"
                                style={{ width: `${progress}%` }}
                                layoutId="progressBar"
                            />
                        </div>
                    </div>

                    {/* Controls */}
                    <div className="flex items-center justify-between pt-1">
                        <button onClick={playPrev} className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-full transition-all">
                            <SkipBack size={20} fill="currentColor" />
                        </button>

                        <button
                            onClick={() => setIsPlaying(!isPlaying)}
                            className="w-10 h-10 bg-white text-indigo-600 rounded-full flex items-center justify-center shadow-lg hover:scale-105 active:scale-95 transition-all"
                        >
                            {isPlaying ? (
                                <Pause size={20} fill="currentColor" />
                            ) : (
                                <Play size={20} fill="currentColor" className="ml-0.5" />
                            )}
                        </button>

                        <button onClick={playNext} className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-full transition-all">
                            <SkipForward size={20} fill="currentColor" />
                        </button>
                    </div>
                </div>
            </div>
        </GlassCard>
    );
};

export default MusicPlayerWidget;
