import axios from 'axios';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export interface Song {
    id: string;
    title: string;
    artist: string;
    album: string;
    url: string;
    coverUrl?: string;
    duration?: number;
}

interface MusicState {
    playlist: Song[];
    currentSong: Song | null;
    isPlaying: boolean;
    isLoading: boolean;
    error: string | null;
    fetchPlaylist: () => Promise<void>;
    setCurrentSong: (song: Song) => void;
    setIsPlaying: (isPlaying: boolean) => void;
    playNext: () => void;
    playPrev: () => void;
}

const useMusicStore = create<MusicState>()(
    persist(
        (set, get) => ({
            playlist: [],
            currentSong: null,
            isPlaying: false,
            isLoading: false,
            error: null,

            fetchPlaylist: async () => {
                set({ isLoading: true, error: null });
                try {
                    console.log("🎵 Fetching music from API...");
                    const response = await axios.get('http://100.64.22.2:8022/api/music');
                    console.log("✅ Music fetched successfully:", response.data);

                    if (response.data && Array.isArray(response.data.files)) {
                        const mappedSongs: Song[] = response.data.files.map((file: any) => ({
                            id: file.name,
                            title: file.name.replace(/\.(mp3|wav|flac)$/i, ''), // Remove extension
                            artist: 'Unknown Artist', // Parsing from filename is brittle without regex, keeping it simple for now
                            album: 'Unknown Album',
                            url: `http://100.64.22.2:8022${file.url}`,
                            coverUrl: undefined, // API doesn't seem to provide cover yet
                            duration: 0
                        }));

                        set({ playlist: mappedSongs, currentSong: mappedSongs[0], isLoading: false });
                    } else {
                        console.warn("⚠️ API returned unexpected structure:", response.data);
                        set({ playlist: [], isLoading: false });
                    }

                } catch (error) {
                    console.error("❌ Failed to fetch music:", error);
                    set({ error: (error as Error).message, isLoading: false });
                }
            },

            setCurrentSong: (song) => set({ currentSong: song, isPlaying: true }),
            setIsPlaying: (isPlaying) => set({ isPlaying }),

            playNext: () => {
                const { playlist, currentSong } = get();
                if (!currentSong || playlist.length === 0) return;
                const currentIndex = playlist.findIndex(s => s.id === currentSong.id);
                const nextIndex = (currentIndex + 1) % playlist.length;
                set({ currentSong: playlist[nextIndex], isPlaying: true });
            },

            playPrev: () => {
                const { playlist, currentSong } = get();
                if (!currentSong || playlist.length === 0) return;
                const currentIndex = playlist.findIndex(s => s.id === currentSong.id);
                const prevIndex = (currentIndex - 1 + playlist.length) % playlist.length;
                set({ currentSong: playlist[prevIndex], isPlaying: true });
            }
        }),
        {
            name: 'music-storage',
            storage: createJSONStorage(() => localStorage),
            partialize: (state) => ({ playlist: state.playlist, currentSong: state.currentSong }),
        }
    )
);

export { useMusicStore };
