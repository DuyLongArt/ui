import React, { useEffect, useState, useRef } from "react";
import { AnalogButton } from "./AnalogButton";
import { useMusicStore } from "../../../OrchestraLayer/StateManager/Zustand/musicStore";

export const CassettePlayer = () => {
    const { currentSong, fetchPlaylist } = useMusicStore();
    const [isPlaying, setIsPlaying] = useState(false);
    const [reelRotation, setReelRotation] = useState(0);
    const [tapeDeck, setTapeDeck] = useState<'A' | 'B'>('A');
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const animationRef = useRef<number | null>(null);

    useEffect(() => {
        fetchPlaylist();
    }, [fetchPlaylist]);

    useEffect(() => {
        if (currentSong) {
            if (audioRef.current) {
                audioRef.current.pause();
            }
            audioRef.current = new Audio(currentSong.url);
            audioRef.current.loop = true;
            if (isPlaying) {
                audioRef.current.play().catch(e => console.error("Playback failed:", e));
            }
        }
    }, [currentSong, isPlaying]);

    useEffect(() => {
        if (audioRef.current) {
            if (isPlaying) {
                audioRef.current.play().catch(e => console.error("Playback failed:", e));
                startReelAnimation();
            } else {
                audioRef.current.pause();
                stopReelAnimation();
            }
        }
    }, [isPlaying]);

    const startReelAnimation = () => {
        const animate = () => {
            setReelRotation(prev => (prev + 1.5) % 360);
            animationRef.current = requestAnimationFrame(animate);
        };
        animationRef.current = requestAnimationFrame(animate);
    };

    const stopReelAnimation = () => {
        if (animationRef.current) {
            cancelAnimationFrame(animationRef.current);
            animationRef.current = null;
        }
    };

    return (
        <div className="bg-linear-to-br from-zinc-900 to-black border-4 border-pink-500/30 rounded-2xl p-6 shadow-[0_0_20px_rgba(236,72,153,0.3)] max-w-md mx-auto">
            {/* Header with City Pop Vibes */}
            <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-pink-400 mb-2 font-mono tracking-tighter italic uppercase">
                    {currentSong?.title || "NO TAPE"}
                </h3>
                <div className="text-cyan-400 font-mono text-xs uppercase tracking-[0.3em]">
                    {currentSong?.artist || "UNKNOWN"} • {currentSong?.album || "UNKNOWN"}
                </div>
            </div>

            {/* Cassette tape */}
            <div className="bg-zinc-800 rounded-xl p-4 mb-8 border-4 border-zinc-700 shadow-inner relative overflow-hidden">
                <div className="absolute inset-0 bg-linear-to-tr from-transparent via-white/10 to-transparent pointer-events-none z-10"></div>

                {/* Tape label - Japanese Aesthetic */}
                <div className={`bg-white rounded p-2 mb-4 text-center border-l-[12px] ${tapeDeck === 'A' ? 'border-pink-500' : 'border-cyan-500'} shadow-sm transition-all duration-700`}>
                    <div className="text-black font-black text-sm tracking-widest uppercase truncate">{currentSong?.artist || "TAKEUCHI MARIYA"}</div>
                    <div className="text-zinc-600 text-[10px] font-bold truncate">{currentSong?.title || "プラスティック・ラヴ"}</div>
                    <div className="flex justify-between px-4 mt-1 text-[8px] font-mono text-pink-600">
                        <span>NR [ON]</span>
                        <span>SIDE {tapeDeck}</span>
                        <span>POSITION [CHROME]</span>
                    </div>
                </div>

                {/* Cassette reels */}
                <div className="flex justify-between items-center px-4 py-2 bg-black/40 rounded-lg border border-zinc-700">
                    <Reel rotation={reelRotation} />
                    <div className="flex-1 mx-4 h-10 bg-zinc-900 rounded flex items-center justify-center border border-zinc-800 overflow-hidden">
                        <div className="w-full h-4 bg-pink-500/10 absolute"></div>
                        <div className="w-full h-[1px] bg-pink-500/40"></div>
                    </div>
                    <Reel rotation={reelRotation} />
                </div>
            </div>

            {/* Controls */}
            <div className="grid grid-cols-3 gap-3 mb-6">
                <AnalogButton variant="chrome" size="md" onClick={() => { }}>REV</AnalogButton>
                <AnalogButton
                    variant="amber"
                    size="md"
                    onClick={() => setIsPlaying(!isPlaying)}
                    isPressed={isPlaying}
                >
                    {isPlaying ? 'STOP' : 'PLAY'}
                </AnalogButton>
                <AnalogButton variant="chrome" size="md" onClick={() => { }}>FWD</AnalogButton>
            </div>

            <div className="flex justify-center space-x-4 pt-4 border-t border-zinc-800">
                <button
                    onClick={() => setTapeDeck('A')}
                    className={`text-[10px] font-mono px-3 py-1 rounded ${tapeDeck === 'A' ? 'bg-pink-500 text-white' : 'text-zinc-500 border border-zinc-800'}`}
                >
                    SIDE A
                </button>
                <button
                    onClick={() => setTapeDeck('B')}
                    className={`text-[10px] font-mono px-3 py-1 rounded ${tapeDeck === 'B' ? 'bg-cyan-500 text-white' : 'text-zinc-500 border border-zinc-800'}`}
                >
                    SIDE B
                </button>
            </div>
        </div>
    );
};

// Sub-component for code cleanliness
const Reel = ({ rotation }: { rotation: number }) => (
    <div className="w-14 h-14 border-2 border-zinc-600 rounded-full bg-zinc-900 flex items-center justify-center shadow-inner">
        <div
            className="w-10 h-10 bg-zinc-100 rounded-full flex items-center justify-center relative"
            style={{ transform: `rotate(${rotation}deg)` }}
        >
            <div className="absolute w-full h-[2px] bg-zinc-400"></div>
            <div className="absolute h-full w-[2px] bg-zinc-400"></div>
            <div className="w-4 h-4 bg-zinc-800 rounded-full z-10 border border-zinc-400"></div>
        </div>
    </div>
);