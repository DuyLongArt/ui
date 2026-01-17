import React, { useEffect, useRef, useState } from "react";
import { Inbox, Mail, Snowflake, X, Play, Pause } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useMusicStore } from "@/OrchestraLayer/StateManager/Zustand/musicStore";

interface DrawerProps {
    isOpen: boolean;
    onClose: (isOpen: boolean) => void;
}

const CustomDrawer: React.FC<DrawerProps> = ({ isOpen, onClose }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const audioRef = useRef<HTMLAudioElement | null>(null);

    // Destructure everything needed from the store once
    const {
        currentSong,
        isPlaying,
        playlist,
        setIsPlaying,
        setCurrentSong,
        // playPause
    } = useMusicStore();

    const [openMusicList, setOpenMusicList] = useState(false);

    const handleClose = () => onClose(false);

    // Close drawer on Escape key press
    useEffect(() => {
        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape" && isOpen) handleClose();
        };
        document.addEventListener("keydown", onKeyDown);
        return () => document.removeEventListener("keydown", onKeyDown);
    }, [isOpen]);

    // Navigation handlers
    const goHome = () => {
        if (location.pathname !== "/home/index") {
            navigate("/home/index");
        }
        onClose(false);
    };

    const go = (target: string) => {
        navigate("/" + target);
        onClose(false);
    };

    // Global Audio Logic
    useEffect(() => {
        if (currentSong && audioRef.current) {
            if (audioRef.current.src !== currentSong.url) {
                audioRef.current.src = currentSong.url;
            }
            if (isPlaying) {
                audioRef.current.play().catch(e => console.error("Playback error:", e));
            } else {
                audioRef.current.pause();
            }
        }
    }, [currentSong, isPlaying]);

    return (
        <>
            {/* Hidden Audio Element */}
            {/* <audio ref={audioRef} /> */}

            {/* Backdrop */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 transition-opacity"
                    onClick={handleClose}
                    aria-hidden="true"
                />
            )}

            {/* Drawer */}
            <div
                className={`fixed left-0 top-0 h-full w-64 bg-white shadow-2xl transform transition-transform duration-300 ease-in-out z-50 ${isOpen ? "translate-x-0" : "-translate-x-full"
                    }`}
                role="dialog"
                aria-modal="true"
            >
                <div className="flex flex-col h-full">
                    {/* Header */}
                    <div className="p-6 flex items-center justify-between border-b border-gray-100">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center shadow-md">
                                <Inbox size={18} className="text-white" />
                            </div>
                            <div>
                                <h2 className="text-sm font-bold text-gray-800">Navigation</h2>
                                <p className="text-[10px] text-gray-500 uppercase tracking-widest">Main Menu</p>
                            </div>
                        </div>
                        <button onClick={handleClose} className="text-gray-400 hover:text-gray-600 transition-colors">
                            <X size={20} />
                        </button>
                    </div>

                    {/* Nav Links */}
                    <nav className="p-4 flex-grow overflow-y-auto">
                        <ul className="space-y-2">
                            {[
                                { name: "Home", path: "/home/index", icon: <Inbox size={20} />, action: goHome },

                            ].map((item) => {
                                const isActive = location.pathname === item.path || (item.path !== "/home/index" && location.pathname.includes(item.path));
                                return (
                                    <li key={item.name}>
                                        <button
                                            onClick={item.action}
                                            className={`w-full flex items-center p-3 rounded-xl transition-all ${isActive ? "bg-indigo-50 text-indigo-600" : "text-gray-600 hover:bg-gray-50"
                                                }`}
                                        >
                                            <span className={`mr-3 ${isActive ? "text-indigo-600" : "text-gray-400"}`}>
                                                {item.icon}
                                            </span>
                                            <span className="font-medium text-sm">{item.name}</span>
                                        </button>
                                    </li>
                                );
                            })}
                        </ul>
                    </nav>

                    {/* Mini Player Section */}
                    {currentSong && (
                        <div className="mx-4 mb-2 p-3 bg-indigo-600 rounded-xl text-white shadow-lg shadow-indigo-100">
                            <div className="flex items-center justify-between mb-2">
                                <div className="min-w-0">
                                    <p className="text-xs font-bold truncate">{currentSong.title}</p>
                                    <p className="text-[10px] opacity-80 truncate">{currentSong.artist}</p>
                                </div>
                                {/* <button
                                    onClick={() => playPause()}
                                    className="p-2 bg-white/20 rounded-full hover:bg-white/30 transition-colors"
                                >
                                    {isPlaying ? <Pause size={14} fill="white" /> : <Play size={14} fill="white" />}
                                </button> */}
                            </div>

                            {/* Playlist Toggle */}
                            <button
                                onClick={() => setOpenMusicList(!openMusicList)}
                                className="w-full text-[10px] text-center py-1 border-t border-white/10 mt-1 hover:text-indigo-200"
                            >
                                {openMusicList ? "Close Playlist" : "View Playlist"}
                            </button>
                        </div>
                    )}

                    {/* Expanded Playlist Overlay */}
                    {openMusicList && (
                        <div className="absolute bottom-20 left-4 right-4 bg-gray-900 rounded-xl shadow-2xl overflow-hidden z-[60] max-h-48 flex flex-col">
                            <div className="p-2 bg-gray-800 text-[10px] font-bold text-gray-400 uppercase">Up Next</div>
                            <div className="overflow-y-auto">
                                {playlist.map((track) => (
                                    <div
                                        key={track.id}
                                        onClick={() => {
                                            setCurrentSong(track);
                                            setOpenMusicList(false);
                                        }}
                                        className={`p-2 text-xs cursor-pointer border-b border-gray-800 hover:bg-gray-800 ${currentSong?.id === track.id ? 'text-indigo-400' : 'text-gray-300'}`}
                                    >
                                        {track.title}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Footer */}
                    <div className="p-4 border-t border-gray-100 bg-gray-50/50">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-white">
                                <Snowflake size={20} />
                            </div>
                            <div className="text-xs">
                                <p className="font-bold text-gray-700">Guest User</p>
                                <p className="text-gray-400">Offline Mode</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default CustomDrawer;