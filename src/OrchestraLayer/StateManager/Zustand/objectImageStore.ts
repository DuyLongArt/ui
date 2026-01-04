import { create } from 'zustand';

interface ObjectImageEtag {
    avatarVersion: number;
    coverVersion: number;
}

interface ObjectImageEtagState {
    versions: ObjectImageEtag; // Renamed to 'versions' for clarity
    incrementAvatarVersion: () => void;
    incrementCoverVersion: () => void;
}

export const useObjectImageEtagStore = create<ObjectImageEtagState>((set) => ({
    versions: {
        avatarVersion: 0,
        coverVersion: 0,
    },

    incrementAvatarVersion: () =>
        set((state) => ({
            versions: { ...state.versions, avatarVersion: state.versions.avatarVersion + 1 }
        })),

    incrementCoverVersion: () =>
        set((state) => ({
            versions: { ...state.versions, coverVersion: state.versions.coverVersion + 1 }
        })),
}));