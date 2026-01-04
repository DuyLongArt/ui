import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PlusIcon, XMarkIcon, TrashIcon, LinkIcon, TagIcon, PencilIcon } from '@heroicons/react/24/outline';
import { useShortcutStore, type Shortcut } from '../../OrchestraLayer/StateManager/Zustand/shortcutStore';

// --- Components ---

const GridContainer: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
    return (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 p-4">
            {children}
        </div>
    );
};

interface GridItemProps extends Shortcut {
    onRemove: (id: string) => void;
    onEdit: (shortcut: Shortcut) => void;
}

const GridItem: React.FC<GridItemProps> = ({ id, title, url, imageUrl, color = 'bg-indigo-600', onRemove, onEdit }) => {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <motion.div
            layout
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            whileHover={{ y: -5, boxShadow: "0px 10px 20px rgba(0,0,0,0.1)" }}
            className={`relative rounded-2xl overflow-hidden shadow-md aspect-square flex flex-col group ${color}`}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <a href={url} target="_blank" rel="noopener noreferrer" className="flex-1 flex flex-col items-center justify-center p-4 text-center h-full w-full">
                {imageUrl ? (
                    <img src={imageUrl} alt={title} className="w-16 h-16 object-contain mb-4 filter drop-shadow-lg" />
                ) : (
                    <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mb-4 backdrop-blur-sm">
                        <LinkIcon className="w-8 h-8 text-white" />
                    </div>
                )}
                <span className="text-white font-bold text-lg tracking-wide drop-shadow-md">{title}</span>
            </a>

            <AnimatePresence>
                {isHovered && (
                    <div className="absolute top-3 right-3 flex gap-2 z-10">
                        <motion.button
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            onClick={(e) => {
                                e.preventDefault();
                                onEdit({ id, title, url, imageUrl, color });
                            }}
                            className="p-2 bg-white/20 text-white rounded-full hover:bg-white/30 shadow-lg backdrop-blur-sm transition-colors"
                        >
                            <PencilIcon className="w-4 h-4" />
                        </motion.button>
                        <motion.button
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            onClick={(e) => {
                                e.preventDefault();
                                onRemove(id);
                            }}
                            className="p-2 bg-red-500/90 text-white rounded-full hover:bg-red-600 shadow-lg backdrop-blur-sm transition-colors"
                        >
                            <TrashIcon className="w-4 h-4" />
                        </motion.button>
                    </div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

const AddShortcutCard: React.FC<{ onClick: () => void }> = ({ onClick }) => {
    return (
        <motion.button
            layout
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.02, backgroundColor: "rgba(243, 244, 246, 0.8)" }}
            whileTap={{ scale: 0.98 }}
            onClick={onClick}
            className="aspect-square rounded-2xl border-3 border-dashed border-slate-300 flex flex-col items-center justify-center bg-slate-50 text-slate-400 hover:text-indigo-500 hover:border-indigo-400 hover:bg-slate-100 transition-all cursor-pointer group"
        >
            <div className="w-16 h-16 rounded-full bg-slate-200 group-hover:bg-indigo-100 flex items-center justify-center mb-3 transition-colors">
                <PlusIcon className="w-8 h-8 text-slate-400 group-hover:text-indigo-600 transition-colors" />
            </div>
            <span className="font-semibold transition-colors">Add Shortcut</span>
        </motion.button>
    );
};

// --- Main Integration ---

function GridComponent() {
    const { shortcuts, addShortcut, updateShortcut, removeShortcut } = useShortcutStore();
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Form State
    const [editingId, setEditingId] = useState<string | null>(null);
    const [title, setTitle] = useState('');
    const [url, setUrl] = useState('');
    const [color, setColor] = useState('bg-indigo-600');

    const handleOpenModal = (shortcut?: Shortcut) => {
        if (shortcut) {
            setEditingId(shortcut.id);
            setTitle(shortcut.title);
            setUrl(shortcut.url);
            setColor(shortcut.color || 'bg-indigo-600');
        } else {
            setEditingId(null);
            setTitle('');
            setUrl('');
            setColor('bg-indigo-600');
        }
        setIsModalOpen(true);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (title && url) {
            if (editingId) {
                updateShortcut(editingId, { title, url, color });
            } else {
                addShortcut({ title, url, color });
            }
            closeModal();
        }
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingId(null);
        setTitle('');
        setUrl('');
        setColor('bg-indigo-600');
    };

    const colorOptions = [
        { name: 'Indigo', value: 'bg-indigo-600' },
        { name: 'Blue', value: 'bg-blue-600' },
        { name: 'Purple', value: 'bg-purple-600' },
        { name: 'Pink', value: 'bg-pink-600' },
        { name: 'Green', value: 'bg-emerald-600' },
        { name: 'Orange', value: 'bg-orange-600' },
        { name: 'Red', value: 'bg-rose-600' },
        { name: 'Slate', value: 'bg-slate-700' },
    ];

    return (
        <div className="w-full">
            <GridContainer>
                <AnimatePresence mode='popLayout'>
                    {shortcuts.map((shortcut) => (
                        <GridItem
                            key={shortcut.id}
                            {...shortcut}
                            onRemove={removeShortcut}
                            onEdit={handleOpenModal}
                        />
                    ))}
                    <AddShortcutCard key="add-button" onClick={() => handleOpenModal()} />
                </AnimatePresence>
            </GridContainer>

            {/* Modal */}
            <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                            onClick={closeModal}
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden z-10"
                        >
                            <div className="flex justify-between items-center p-5 border-b border-slate-100 bg-slate-50/50">
                                <h3 className="text-xl font-bold text-slate-800">{editingId ? 'Edit Shortcut' : 'Add New Shortcut'}</h3>
                                <button onClick={closeModal} className="p-2 rounded-full hover:bg-slate-200 text-slate-500 transition-colors">
                                    <XMarkIcon className="w-5 h-5" />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="p-6 space-y-5">
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-700 ml-1">Title</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <TagIcon className="h-5 w-5 text-slate-400" />
                                        </div>
                                        <input
                                            type="text"
                                            value={title}
                                            onChange={(e) => setTitle(e.target.value)}
                                            placeholder="e.g. Google Drive"
                                            className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all text-slate-800"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-700 ml-1">URL</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <LinkIcon className="h-5 w-5 text-slate-400" />
                                        </div>
                                        <input
                                            type="url"
                                            value={url}
                                            onChange={(e) => setUrl(e.target.value)}
                                            placeholder="https://..."
                                            className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all text-slate-800"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-700 ml-1">Card Color</label>
                                    <div className="grid grid-cols-4 gap-3">
                                        {colorOptions.map((opt) => (
                                            <button
                                                key={opt.value}
                                                type="button"
                                                onClick={() => setColor(opt.value)}
                                                className={`h-10 rounded-lg shadow-sm transition-all ${opt.value} ${color === opt.value ? 'ring-2 ring-offset-2 ring-indigo-500 scale-105' : 'hover:scale-105 opacity-80 hover:opacity-100'}`}
                                                aria-label={opt.name}
                                            />
                                        ))}
                                    </div>
                                </div>

                                <div className="pt-4 flex gap-3">
                                    <button
                                        type="button"
                                        onClick={closeModal}
                                        className="flex-1 px-4 py-3 font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="flex-1 px-4 py-3 font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-lg shadow-indigo-200 transition-all hover:-translate-y-0.5"
                                    >
                                        {editingId ? 'Update Shortcut' : 'Create Shortcut'}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}

export default GridComponent;