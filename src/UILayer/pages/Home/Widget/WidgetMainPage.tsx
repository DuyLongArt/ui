import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Typography } from "@material-tailwind/react";
import { GlassCard } from '../Person/GlassContainer';
import {
  FolderIcon,
  PlusIcon,
  ArrowLeftIcon,
  EllipsisVerticalIcon,
  TrashIcon,
  PencilIcon,
  GlobeAltIcon,
  Squares2X2Icon,
  MusicalNoteIcon
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
import { useDownloadYoutubeMusicMutation } from '../../../../DataLayer/APILayer/youtubeQueries';

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
  const downloadYoutubeMutation = useDownloadYoutubeMusicMutation();

  const [isYoutubeModalOpen, setIsYoutubeModalOpen] = useState(false);
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [downloadStatus, setDownloadStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [statusMessage, setStatusMessage] = useState('');

  const handleDownloadYoutube = (e: React.FormEvent) => {
    e.preventDefault();
    setDownloadStatus('loading');
    setStatusMessage('Initiating download...');

    downloadYoutubeMutation.mutate({ url: youtubeUrl }, {
      onSuccess: (data) => {
        setDownloadStatus('success');
        setStatusMessage('Download started successfully! It will appear in your library soon.');
        setYoutubeUrl('');
        setTimeout(() => {
          setIsYoutubeModalOpen(false);
          setDownloadStatus('idle');
          setStatusMessage('');
        }, 3000);
      },
      onError: (error: any) => {
        setDownloadStatus('error');
        setStatusMessage(error.response?.data?.message || 'Failed to start download. Please check the URL.');
      }
    });
  };

  const commonProps = {
    placeholder: undefined,
    onPointerEnterCapture: undefined,
    onPointerLeaveCapture: undefined,
    onResize: undefined,
    onResizeCapture: undefined,
  } as any;

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
    <div className="min-h-screen bg-slate-50 relative overflow-hidden pb-20">
      {/* Background Decoration */}
      <div className="absolute top-0 left-0 w-full h-96 bg-linear-to-b from-blue-50/50 to-transparent -z-10" />
      <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-indigo-100/40 rounded-full blur-3xl -z-10" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-blue-100/30 rounded-full blur-3xl -z-10" />

      <div className="max-w-7xl mx-auto p-6 lg:p-10 relative z-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
          <div className="space-y-4">
            <AnimatePresence mode="wait">
              {currentFolder ? (
                <motion.button
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  onClick={() => setCurrentFolder(null)}
                  className="flex items-center text-slate-500 hover:text-indigo-600 font-bold group transition-all text-sm mb-2"
                >
                  <ArrowLeftIcon className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                  Back to Folders
                </motion.button>
              ) : (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-2 text-xs font-bold text-indigo-500 tracking-wider uppercase mb-2 bg-indigo-50 px-3 py-1 rounded-full w-fit"
                >
                  <Squares2X2Icon className="w-4 h-4" />
                  <span>Dashboard</span>
                </motion.div>
              )}
            </AnimatePresence>

            <div>
              <Typography variant="h1" className="text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-tight" {...commonProps}>
                {currentFolder ? (
                  <span className="bg-clip-text text-transparent bg-linear-to-r from-slate-900 to-slate-700">
                    {currentFolder.folderName}
                  </span>
                ) : (
                  <>
                    <span className="block text-slate-400 font-medium text-2xl md:text-3xl mb-1">Welcome back,</span>
                    <span className="bg-clip-text text-transparent bg-linear-to-r from-indigo-600 to-violet-600">
                      My Collections
                    </span>
                  </>
                )}
              </Typography>
              <Typography className="text-slate-500 mt-4 font-medium text-lg max-w-2xl leading-relaxed" {...commonProps}>
                {currentFolder
                  ? `Manage and access your shortcuts within the ${currentFolder.folderName} collection.`
                  : "Organize your digital workspace. Access your favorite tools and links from one central hub."}
              </Typography>
            </div>
          </div>
        </div>

        <div className="flex gap-4">
          <motion.button
            whileHover={{ scale: 1.02, textShadow: "0px 0px 8px rgb(255 255 255 / 0.5)" }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setIsYoutubeModalOpen(true)}
            className="group relative overflow-hidden bg-white text-indigo-600 px-6 py-4 rounded-xl font-bold flex items-center shadow-lg hover:shadow-indigo-500/10 transition-all duration-300 border border-indigo-100"
          >
            <div className="relative flex items-center gap-3">
              <span className="bg-indigo-50 p-1.5 rounded-lg">
                <MusicalNoteIcon className="w-5 h-5 stroke-[2px]" />
              </span>
              <span>Download Music</span>
            </div>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02, textShadow: "0px 0px 8px rgb(255 255 255 / 0.5)" }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setIsAddModalOpen(true)}
            className="group relative overflow-hidden bg-slate-900 text-white px-8 py-4 rounded-xl font-bold flex items-center shadow-lg hover:shadow-indigo-500/30 transition-all duration-300"
          >
            <div className="absolute inset-0 bg-linear-to-r from-indigo-500 to-violet-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="relative flex items-center gap-3">
              <span className="bg-white/20 p-1.5 rounded-lg">
                <PlusIcon className="w-5 h-5 stroke-[3px]" />
              </span>
              <span>{currentFolder ? "Add Widget" : "New Folder"}</span>
            </div>
          </motion.button>
        </div>

        {/* Grid Container */}
        <motion.div
          layout
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        >
          <AnimatePresence mode="popLayout">
            {!currentFolder ? (
              // Render Folders
              folders?.map((folder) => (
                <GlassCard
                  key={`folder-${folder.id}`}
                  onClick={() => setCurrentFolder(folder)}
                  className="group relative min-h-[220px] p-0 overflow-hidden cursor-pointer hover:-translate-y-2 text-slate-800! bg-white/80! hover:bg-white! border-white/60"
                  color="from-white via-white to-white"
                >
                  <div className="absolute inset-0 bg-linear-to-br from-indigo-50/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                  <div className="p-8 h-full flex flex-col justify-between relative z-10">
                    <div className="flex justify-between items-start">
                      <div className="w-14 h-14 bg-indigo-50/80 rounded-2xl flex items-center justify-center group-hover:scale-110 group-hover:bg-indigo-100 transition-all duration-300 shadow-xs">
                        <FolderIcon className="w-7 h-7 text-indigo-600" />
                      </div>
                      <button
                        onClick={(e) => handleDeleteFolder(e, folder.id)}
                        className="p-2 -mr-2 -mt-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all opacity-0 group-hover:opacity-100"
                      >
                        <TrashIcon className="w-5 h-5" />
                      </button>
                    </div>

                    <div>
                      <h3 className="text-xl font-bold text-slate-800 group-hover:text-indigo-700 transition-colors mb-2">
                        {folder.folderName}
                      </h3>
                      <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                        <span className="w-2 h-2 rounded-full bg-indigo-400"></span>
                        <span>Collection</span>
                      </div>
                    </div>
                  </div>
                </GlassCard>
              ))
            ) : (
              // Render Shortcuts
              shortcuts?.map((shortcut) => (
                <GlassCard
                  key={`shortcut-${shortcut.id}`}
                  className="group relative min-h-[220px] p-0 flex flex-col justify-between text-slate-800! bg-white/80! hover:bg-white! border-white/60"
                  color="from-white via-white to-white"
                >
                  <div className="p-8 pb-0 relative z-10">
                    <div className="flex justify-between items-start mb-6">
                      <div className="w-14 h-14 bg-blue-50/80 rounded-2xl flex items-center justify-center group-hover:scale-110 group-hover:bg-blue-100 transition-all duration-300 shadow-xs">
                        <GlobeAltIcon className="w-7 h-7 text-blue-600" />
                      </div>
                      <button
                        onClick={(e) => handleDeleteShortcut(e, shortcut.id)}
                        className="p-2 -mr-2 -mt-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all opacity-0 group-hover:opacity-100"
                      >
                        <TrashIcon className="w-5 h-5" />
                      </button>
                    </div>

                    <h3 className="text-xl font-bold text-slate-800 truncate mb-1">
                      {shortcut.shortcutName}
                    </h3>
                    <p className="text-slate-400 font-medium text-xs truncate opacity-70">
                      {shortcut.shortcutUrl.replace(/^https?:\/\//, '')}
                    </p>
                  </div>

                  <div className="p-6 relative z-10 mt-auto">
                    <a
                      href={shortcut.shortcutUrl.startsWith('http') ? shortcut.shortcutUrl : `https://${shortcut.shortcutUrl}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center w-full py-3 px-4 bg-slate-50 text-slate-600 font-bold text-sm rounded-xl hover:bg-blue-600 hover:text-white transition-all duration-300 group-hover:shadow-lg group-hover:shadow-blue-200"
                    >
                      Open Link
                      <ArrowLeftIcon className="w-4 h-4 ml-2 rotate-135" />
                    </a>
                  </div>
                </GlassCard>
              ))
            )}

            {/* Empty States */}
            {!foldersLoading && !currentFolder && folders?.length === 0 && (
              <div className="col-span-full py-24 text-center">
                <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <FolderIcon className="w-10 h-10 text-slate-300" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-2">No collections yet</h3>
                <p className="text-slate-500">Create your first collection to get started.</p>
              </div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Youtube Download Modal */}
      <AnimatePresence>
        {isYoutubeModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 lg:p-10">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsYoutubeModalOpen(false)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden border border-white/50"
            >
              <div className="p-8 lg:p-10 bg-linear-to-br from-red-50 to-white">
                <h2 className="text-3xl font-bold text-slate-900 mb-2">
                  Download Music
                </h2>
                <p className="text-slate-500 font-medium">
                  Paste a YouTube link to download and add it to your library.
                </p>

                <form onSubmit={handleDownloadYoutube} className="mt-8 space-y-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">
                      YouTube URL
                    </label>
                    <div className="relative">
                      <input
                        autoFocus
                        type="url"
                        value={youtubeUrl}
                        onChange={(e) => setYoutubeUrl(e.target.value)}
                        placeholder="https://youtu.be/..."
                        className="w-full bg-white border border-slate-200 rounded-xl pl-4 pr-12 py-3 text-lg font-semibold text-slate-900 placeholder:text-slate-300 focus:border-red-500 focus:ring-4 focus:ring-red-500/10 outline-none transition-all"
                        required
                      />
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 text-red-500">
                        <MusicalNoteIcon className="w-6 h-6" />
                      </div>
                    </div>
                  </div>

                  {/* Status Messages */}
                  <AnimatePresence mode='wait'>
                    {downloadStatus !== 'idle' && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className={`p-4 rounded-xl text-sm font-bold ${downloadStatus === 'loading' ? 'bg-blue-50 text-blue-600' :
                          downloadStatus === 'success' ? 'bg-green-50 text-green-600' :
                            'bg-red-50 text-red-600'
                          }`}
                      >
                        {statusMessage}
                      </motion.div>
                    )}
                  </AnimatePresence>


                  <div className="flex gap-4 pt-4">
                    <button
                      type="button"
                      onClick={() => setIsYoutubeModalOpen(false)}
                      className="flex-1 px-6 py-3.5 rounded-xl font-bold text-slate-500 hover:bg-slate-100 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={downloadStatus === 'loading'}
                      className="flex-1 bg-red-600 text-white px-6 py-3.5 rounded-xl font-bold shadow-lg shadow-red-200 hover:bg-red-700 hover:shadow-red-300 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      {downloadStatus === 'loading' ? (
                        <>
                          <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          Processing...
                        </>
                      ) : (
                        'Download'
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Add Modal */}
      <AnimatePresence>
        {isAddModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 lg:p-10">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAddModalOpen(false)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden border border-white/50"
            >
              <div className="p-8 lg:p-10 bg-linear-to-br from-indigo-50/50 to-white">
                <h2 className="text-3xl font-bold text-slate-900 mb-2">
                  {currentFolder ? "New Widget" : "New Folder"}
                </h2>
                <p className="text-slate-500 font-medium">
                  {currentFolder
                    ? "Add a quick shortcut to your collection."
                    : "Create a new collection to organize your widgets."}
                </p>

                <form onSubmit={handleAdd} className="mt-8 space-y-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">
                      {currentFolder ? "Widget Name" : "Folder Name"}
                    </label>
                    <input
                      autoFocus
                      type="text"
                      value={newItemName}
                      onChange={(e) => setNewItemName(e.target.value)}
                      placeholder={currentFolder ? "e.g. Facebook" : "e.g. Social Media"}
                      className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-lg font-semibold text-slate-900 placeholder:text-slate-300 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all"
                      required
                    />
                  </div>

                  {currentFolder && (
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">
                        Destination URL
                      </label>
                      <input
                        type="text"
                        value={newItemUrl}
                        onChange={(e) => setNewItemUrl(e.target.value)}
                        placeholder="example.com"
                        className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-lg font-semibold text-slate-900 placeholder:text-slate-300 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all"
                        required
                      />
                    </div>
                  )}

                  <div className="flex gap-4 pt-4">
                    <button
                      type="button"
                      onClick={() => setIsAddModalOpen(false)}
                      className="flex-1 px-6 py-3.5 rounded-xl font-bold text-slate-500 hover:bg-slate-100 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={addFolderMutation.isPending || addShortcutMutation.isPending}
                      className="flex-1 bg-indigo-600 text-white px-6 py-3.5 rounded-xl font-bold shadow-lg shadow-indigo-200 hover:bg-indigo-700 hover:shadow-indigo-300 transition-all disabled:opacity-50"
                    >
                      Create
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div >
  );
};

export default WidgetMainPage;
