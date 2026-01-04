import React, { useState, useEffect, useRef } from "react";
import { AnalogButton } from "./AnalogButton";
import { useMusicStore } from "../../../OrchestraLayer/StateManager/Zustand/musicStore";

export const VinylRecord = () => {
    const { currentSong } = useMusicStore();
    const [isSpinning, setIsSpinning] = useState(false);
    const [rpm, setRpm] = useState(33);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    useEffect(() => {
        if (currentSong) {
            if (audioRef.current) {
                audioRef.current.pause();
            }
            audioRef.current = new Audio(currentSong.url);
            audioRef.current.loop = true;
            if (isSpinning) {
                audioRef.current.play().catch(e => console.error("Playback failed:", e));
            }
        }
    }, [currentSong, isSpinning]);

    useEffect(() => {
        if (audioRef.current) {
            if (isSpinning) {
                audioRef.current.play().catch(e => console.error("Playback failed:", e));
            } else {
                audioRef.current.pause();
            }
        }
    }, [isSpinning]);

    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.playbackRate = rpm === 45 ? 1.2 : 1.0;
        }
    }, [rpm]);

    return (
        <div className="bg-linear-to-br from-amber-900 to-orange-900 border-4 border-yellow-500 rounded-2xl p-6 shadow-2xl">
            <div className="text-center mb-4">
                <h3 className="text-lg font-bold text-yellow-200">
                    🎵 TECHNICS SL-1200
                </h3>
                <div className="text-yellow-400 font-mono text-xs">Direct Drive Turntable</div>
            </div>

            {/* Vinyl record */}
            <div className="relative w-48 h-48 mx-auto mb-6">
                <div
                    className={`absolute inset-0 rounded-full bg-black border-4 border-yellow-600 ${isSpinning ? 'animate-spin' : ''
                        }`}
                    style={{
                        background: 'radial-gradient(circle, #1f2937 30%, #000000 70%)',
                        animationDuration: rpm === 33 ? '1.8s' : '1.3s'
                    }}
                >
                    {/* Record grooves */}
                    {Array.from({ length: 8 }, (_, i) => (
                        <div
                            key={i}
                            className="absolute border border-gray-600 rounded-full"
                            style={{
                                top: `${10 + i * 5}%`,
                                left: `${10 + i * 5}%`,
                                right: `${10 + i * 5}%`,
                                bottom: `${10 + i * 5}%`
                            }}
                        />
                    ))}

                    {/* Center label */}
                    <div className="absolute top-1/2 left-1/2 w-20 h-20 bg-linear-to-br from-red-500 to-red-700 rounded-full transform -translate-x-1/2 -translate-y-1/2 flex items-center justify-center border-2 border-yellow-400">
                        <div className="text-center text-yellow-100 p-1">
                            <div className="font-bold text-[8px] uppercase truncate">{currentSong?.album || "CITY POP"}</div>
                            <div className="text-[10px] font-black uppercase tracking-tighter truncate">{currentSong?.title || "CLASSICS"}</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Turntable controls */}
            <div className="grid grid-cols-3 gap-3 mb-4">
                <AnalogButton
                    variant="sepia"
                    size="sm"
                    onClick={() => setRpm(33)}
                    isPressed={rpm === 33}
                >
                    33 RPM
                </AnalogButton>

                <AnalogButton
                    variant="amber"
                    onClick={() => setIsSpinning(!isSpinning)}
                    isPressed={isSpinning}
                >
                    {isSpinning ? 'STOP' : 'START'}
                </AnalogButton>

                <AnalogButton
                    variant="sepia"
                    size="sm"
                    onClick={() => setRpm(45)}
                    isPressed={rpm === 45}
                >
                    45 RPM
                </AnalogButton>
            </div>

            <div className="text-center text-yellow-600 font-mono text-sm">
                Now Playing: {currentSong?.title || "None"}<br />
                Artist: {currentSong?.artist || "Unknown"}
            </div>
        </div>
    );
};