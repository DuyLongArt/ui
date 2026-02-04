import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FolderIcon,
  PlusIcon,
  ArrowLeftIcon,
  EllipsisVerticalIcon,
  TrashIcon,
  PencilIcon,
  GlobeAltIcon
} from '@heroicons/react/24/outline';
import {
  useWidgetFoldersQuery,
  useWidgetShortcutsQuery,
  useAddFolderMutation,
  useAddShortcutMutation,
  useDeleteFolderMutation,
  useDeleteShortcutMutation,
} from '../../../../DataLayer/APILayer/widgetQueries';
import type { WidgetFolder, WidgetShortcut } from '../../../../DataLayer/APILayer/widgetQueries';
import { usePersonInformationQuery } from '../../../../DataLayer/APILayer/userQueries';

const WidgetMainPage: React.FC = () => {
  const [currentFolder, setCurrentFolder] = useState<WidgetFolder | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newItemName, setNewItemName] = useState('');
  const [newItemUrl, setNewItemUrl] = useState('');

  const { data: folders, isLoading: foldersLoading } = useWidgetFoldersQuery();
  const { data: shortcuts, isLoading: shortcutsLoading } = useWidgetShortcutsQuery(currentFolder?.id || null);
  const { data: person } = usePersonInformationQuery();

  const addFolderMutation = useAddFolderMutation();
  const addShortcutMutation = useAddShortcutMutation();
  const deleteFolderMutation = useDeleteFolderMutation();
  const deleteShortcutMutation = useDeleteShortcutMutation();

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentFolder) {
      addShortcutMutation.mutate({
        shortcutName: newItemName,
        shortcutUrl: newItemUrl,
        folder: currentFolder
      }, {
        onSuccess: () => {
          setIsAddModalOpen(false);
          setNewItemName('');
          setNewItemUrl('');
        }
      });
    } else {
      addFolderMutation.mutate({
        folderName: newItemName,
      }, {
        onSuccess: () => {
          setIsAddModalOpen(false);
          setNewItemName('');
        }
      });
    }
  };

  const handleDeleteFolder = (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this folder?')) {
      deleteFolderMutation.mutate(id);
    }
  };

  const handleDeleteShortcut = (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this widget?')) {
      deleteShortcutMutation.mutate({ id, folderId: currentFolder!.id });
    }
  };

  return (
    <div className="min-h-screen bg-secondary-50 p-6 lg:p-10">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <AnimatePresence mode="wait">
              {currentFolder ? (
                <motion.button
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  onClick={() => setCurrentFolder(null)}
                  className="flex items-center text-blue-600 hover:text-blue-700 font-bold mb-2 group transition-all"
                >
                  <ArrowLeftIcon className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
                  Back to Folders
                </motion.button>
              ) : (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-sm font-bold text-blue-600 tracking-wider uppercase mb-2"
                >
                  Overview
                </motion.div>
              )}
            </AnimatePresence>

            <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight italic">
              {currentFolder ? currentFolder.folderName.toUpperCase() : "MY COLLECTIONS"}
            </h1>
            <p className="text-slate-500 mt-2 font-medium">
              {currentFolder
                ? `Manage your shortcuts within ${currentFolder.folderName}`
                : "Organize your favorite links and tools into elegant folders"}
            </p>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setIsAddModalOpen(true)}
            className="bg-slate-900 text-white px-8 py-4 rounded-2xl font-black flex items-center shadow-xl shadow-slate-200 hover:bg-slate-800 transition-all border-b-4 border-slate-700"
          >
            <PlusIcon className="w-6 h-6 mr-2 stroke-[3px]" />
            {currentFolder ? "ADD WIDGET" : "NEW FOLDER"}
          </motion.button>
        </div>
      </div>

      {/* Grid Container */}
      <div className="max-w-7xl mx-auto">
        <motion.div
          layout
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
        >
          <AnimatePresence mode="popLayout">
            {!currentFolder ? (
              // Render Folders
              folders?.map((folder) => (
                <motion.div
                  key={`folder-${folder.id}`}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  whileHover={{ y: -8 }}
                  onClick={() => setCurrentFolder(folder)}
                  className="group relative h-64 bg-white rounded-3xl p-8 border border-slate-200 shadow-sm hover:shadow-2xl hover:border-blue-200 transition-all cursor-pointer flex flex-col justify-between overflow-hidden"
                >
                  {/* Decorative background circle */}
                  <div className="absolute -right-12 -top-12 w-48 h-48 bg-blue-50 rounded-full group-hover:bg-blue-100 transition-colors duration-500 blur-3xl opacity-50" />

                  <div className="relative z-10">
                    <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
                      <FolderIcon className="w-8 h-8 text-blue-600" />
                    </div>
                    <h3 className="text-2xl font-black text-slate-800 tracking-tight leading-tight group-hover:text-blue-600 transition-colors">
                      {folder.folderName}
                    </h3>
                    <p className="text-slate-400 font-bold text-sm mt-1 uppercase tracking-widest">
                      Collection
                    </p>
                  </div>

                  <div className="relative z-10 flex items-center justify-between mt-auto pt-6 border-t border-slate-50">
                    <span className="text-xs font-black text-slate-300 uppercase tracking-widest">
                      ID: {folder.id}
                    </span>
                    <button
                      onClick={(e) => handleDeleteFolder(e, folder.id)}
                      className="opacity-0 group-hover:opacity-100 p-2 text-slate-300 hover:text-red-500 transition-all"
                    >
                      <TrashIcon className="w-5 h-5" />
                    </button>
                  </div>
                </motion.div>
              ))
            ) : (
              // Render Shortcuts
              shortcuts?.map((shortcut) => (
                <motion.div
                  key={`shortcut-${shortcut.id}`}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  whileHover={{ y: -8 }}
                  className="group relative h-64 bg-white rounded-3xl p-8 border border-slate-200 shadow-sm hover:shadow-2xl hover:border-indigo-200 transition-all flex flex-col justify-between overflow-hidden"
                >
                  <div className="absolute -right-12 -top-12 w-48 h-48 bg-indigo-50 rounded-full group-hover:bg-indigo-100 transition-colors duration-500 blur-3xl opacity-50" />

                  <div className="relative z-10">
                    <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
                      <GlobeAltIcon className="w-8 h-8 text-indigo-600" />
                    </div>
                    <h3 className="text-2xl font-black text-slate-800 tracking-tight leading-tight group-hover:text-indigo-600 transition-colors truncate">
                      {shortcut.shortcutName}
                    </h3>
                    <p className="text-slate-400 font-bold text-xs mt-1 truncate lowercase">
                      {person?.alias || 'user'}/{currentFolder?.folderName.toLowerCase().replace(/\s+/g, '-')}/{shortcut.shortcutName.toLowerCase().replace(/\s+/g, '-')}
                    </p>
                  </div>

                  <div className="relative z-10 flex items-center justify-between gap-3 mt-auto pt-6 border-t border-slate-50">
                    <a
                      href={shortcut.shortcutUrl.startsWith('http') ? shortcut.shortcutUrl : `https://${shortcut.shortcutUrl}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 bg-indigo-600 text-white py-3 rounded-xl text-center font-black text-sm tracking-widest hover:bg-indigo-700 transition-all"
                    >
                      OPEN
                    </a>
                    <button
                      onClick={(e) => handleDeleteShortcut(e, shortcut.id)}
                      className="p-3 text-slate-300 hover:text-red-500 transition-all"
                    >
                      <TrashIcon className="w-5 h-5" />
                    </button>
                  </div>
                </motion.div>
              ))
            )}

            {/* Loading States */}
            {((!currentFolder && foldersLoading) || (currentFolder && shortcutsLoading)) && (
              [1, 2, 3, 4].map((i) => (
                <div key={`skeleton-${i}`} className="h-64 bg-slate-100 rounded-3xl animate-pulse" />
              ))
            )}

            {/* Empty States */}
            {!foldersLoading && !currentFolder && folders?.length === 0 && (
              <div className="col-span-full py-20 text-center">
                <FolderIcon className="w-20 h-20 text-slate-200 mx-auto mb-6" />
                <h3 className="text-2xl font-black text-slate-300 tracking-tighter italic uppercase">No collections found</h3>
                <p className="text-slate-400 mt-2">Start by creating your first folder above.</p>
              </div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Add Modal */}
      <AnimatePresence>
        {isAddModalOpen && (
          <div className="fixed inset-0 z-100 flex items-center justify-center p-4 lg:p-10">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAddModalOpen(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 30 }}
              className="relative bg-white w-full max-w-lg rounded-[40px] shadow-2xl p-10 lg:p-14 overflow-hidden"
            >
              <div className="mb-10">
                <h2 className="text-4xl font-black text-slate-900 tracking-tighter italic leading-none mb-4">
                  {currentFolder ? "NEW WIDGET" : "NEW FOLDER"}
                </h2>
                <p className="text-slate-500 font-medium">
                  {currentFolder
                    ? "Add a quick shortcut to your collection."
                    : "Give your new collection a standout name."}
                </p>
              </div>

              <form onSubmit={handleAdd} className="space-y-8">
                <div className="space-y-3">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">
                    {currentFolder ? "Widget Name" : "Folder Name"}
                  </label>
                  <input
                    autoFocus
                    type="text"
                    value={newItemName}
                    onChange={(e) => setNewItemName(e.target.value)}
                    placeholder={currentFolder ? "e.g. Facebook" : "e.g. Social Media"}
                    className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-5 text-xl font-bold text-slate-900 placeholder:text-slate-300 focus:border-blue-500 focus:bg-white outline-none transition-all"
                    required
                  />
                </div>

                {currentFolder && (
                  <div className="space-y-3">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">
                      Destination URL
                    </label>
                    <input
                      type="text"
                      value={newItemUrl}
                      onChange={(e) => setNewItemUrl(e.target.value)}
                      placeholder="facebook.com"
                      className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-5 text-xl font-bold text-slate-900 placeholder:text-slate-300 focus:border-indigo-500 focus:bg-white outline-none transition-all"
                      required
                    />
                  </div>
                )}

                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                  <button
                    type="button"
                    onClick={() => setIsAddModalOpen(false)}
                    className="flex-1 bg-slate-100 text-slate-500 py-5 rounded-2xl font-black text-sm tracking-widest hover:bg-slate-200 transition-all uppercase"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={addFolderMutation.isPending || addShortcutMutation.isPending}
                    className="flex-1 bg-slate-900 text-white py-5 rounded-2xl font-black text-sm tracking-widest shadow-xl shadow-slate-200 hover:bg-slate-800 transition-all uppercase disabled:opacity-50"
                  >
                    Create Item
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default WidgetMainPage;
