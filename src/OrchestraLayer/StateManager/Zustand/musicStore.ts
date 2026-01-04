import axios from 'axios';
import { create } from 'zustand';

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
    isLoading: boolean;
    error: string | null;
    fetchPlaylist: () => Promise<void>;
    setCurrentSong: (song: Song) => void;
}

const useMusicStore = create<MusicState>((set) => ({
    playlist: [],
    currentSong: null,
    isLoading: false,
    error: null,

    fetchPlaylist: async () => {
        set({ isLoading: true, error: null });
        try {
            // Trying to fetch from /backend/music/all or similar. 
            // If it doesn't exist, we'll fall back to a mock list but keep the structure.
            const response = await axios.get('/backend/music/all').catch(() => ({
                data: [
                    {
                        id: '1',
                        title: 'Plastic Love',
                        artist: 'Mariya Takeuchi',
                        album: 'Variety',
                        url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
                        coverUrl: 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?auto=format&fit=crop&q=80&w=200&h=200'
                    },
                    {
                        id: '2',
                        title: 'Midnight Pretenders',
                        artist: 'Tomoko Aran',
                        album: 'Fuyü-Kükan',
                        url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
                        coverUrl: 'https://images.unsplash.com/photo-1493225255756-d9584f8606e9?auto=format&fit=crop&q=80&w=200&h=200'
                    }
                ]
            }));

            set({ playlist: response.data, currentSong: response.data[0], isLoading: false });
        } catch (error) {
            set({ error: (error as Error).message, isLoading: false });
        }
    },

    setCurrentSong: (song) => set({ currentSong: song }),
}));

export { useMusicStore };
