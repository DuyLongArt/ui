import axios from 'axios';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Shortcut {
    id: string;
    title: string;
    url: string;
    imageUrl?: string;
    color?: string;
}

interface ShortcutState {
    shortcuts: Shortcut[];
    addShortcut: (shortcut: Omit<Shortcut, 'id'>) => void;
    updateShortcut: (id: string, shortcut: Partial<Omit<Shortcut, 'id'>>) => void;
    removeShortcut: (id: string) => void;
    fetchShortcuts: () => void;
}

export const useShortcutStore = create<ShortcutState>()(
    persist(
        (set) => ({
            shortcuts: [
                { id: '1', title: 'Widget 1', url: '/widget/1', color: 'bg-indigo-600' },
                { id: '2', title: 'Nextcloud', url: 'http://192.168.3.1:6699/apps/dashboard/', color: 'bg-blue-600' },
            ],
            addShortcut: (shortcut) => set((state) => ({
                shortcuts: [
                    ...state.shortcuts,
                    { ...shortcut, id: Math.random().toString(36).substr(2, 9) }
                ]
            })),
            updateShortcut: (id, updatedFields) => set((state) => ({
                shortcuts: state.shortcuts.map((s) => s.id === id ? { ...s, ...updatedFields } : s)
            })),
            removeShortcut: (id) => set((state) => ({
                shortcuts: state.shortcuts.filter((s) => s.id !== id)
            })),
            fetchShortcuts: () => {
                axios.get("/backend/widget/shortcut").then((res) => {
                    set((state) => ({
                        ...state,
                        shortcuts: res.data
                    }))
                })
            }
        }),
        {
            name: 'shortcut-storage',
        }
    )
);
