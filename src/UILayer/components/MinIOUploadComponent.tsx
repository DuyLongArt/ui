import React, { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useUserProfileStore } from '../../OrchestraLayer/StateManager/Zustand/userProfileStore';

interface MinIOUploadComponentProps {
    onUpload: (file: File) => Promise<string> | void;
    progress?: number;
    isUploading?: boolean;
    error?: string | null;
    acceptedFileTypes?: string; // e.g., "image/*, application/pdf"
    maxSizeInMB?: number;
    nameFromInput?: string;
    mode: string;
    onHandleClose?: () => void;
}

const MinIOUploadComponent: React.FC<MinIOUploadComponentProps> = ({
    onUpload,
    progress = 0,
    isUploading = false,
    error = null,
    acceptedFileTypes = "image/*",
    maxSizeInMB = 30,
    nameFromInput = "",
    mode = "",
    onHandleClose = () => { },
    // avatarUpdate = false
}) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [dragActive, setDragActive] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [localError, setLocalError] = useState<string | null>(null);
    // const [nameFromInput, setNameFromInput] = useState<string>(selectedFile?.name || '');

    const alias = useUserProfileStore((state) => state.information.profiles.alias)
        ;
    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const validateFile = (file: File): boolean => {
        if (file.size > maxSizeInMB * 1024 * 1024) {
            setLocalError(`File size exceeds ${maxSizeInMB}MB limit.`);
            return false;
        }
        // Basic type checking based on mime type, can be expanded
        if (acceptedFileTypes !== "*" && !file.type.match(acceptedFileTypes.replace('*', '.*'))) {
            setLocalError(`File type not accepted.`);
            return false;
        }
        setLocalError(null);
        return true;
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            const file = e.dataTransfer.files[0];
            if (validateFile(file)) {
                setSelectedFile(file);
            }
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            if (validateFile(file)) {
                setSelectedFile(file);
            }
        }
    };

    const handleUploadClick = (nameFromInput: string) => {

        if (nameFromInput === '') {
            // console.log(mode + "_" + alias + ".png");
            nameFromInput = alias + "/" + mode;



        }
        if (selectedFile) {
            const newFile = new File([selectedFile], nameFromInput + ".png", { type: selectedFile.type });
            const result = onUpload(newFile);



            console.log(result);

            if (result && typeof result.then === 'function') {
                result.then(() => {
                    console.log("Upload success (Promise resolved)");
                });
            }
        }
    };

    const handleClear = () => {
        setSelectedFile(null);
        setLocalError(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    return (
        <div className="w-full max-w-md mx-auto p-8 bg-white/40 backdrop-blur-3xl rounded-4xl border border-white/40 shadow-[0_20px_50px_rgba(0,0,0,0.1)] relative overflow-hidden group/container">
            {/* Background Decorative element */}
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl group-hover/container:bg-indigo-500/20 transition-colors duration-700"></div>

            <div className="mb-6 relative z-10">
                <h3 className="text-2xl font-bold bg-linear-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">Update {mode === 'cover' ? 'Cover' : 'Profile'}</h3>
                <p className="text-slate-500 font-medium text-sm mt-1">High quality images recommended</p>
            </div>

            <div
                className={`relative flex flex-col items-center justify-center w-full h-56 border-2 border-dashed rounded-3xl transition-all duration-500 ease-out cursor-pointer overflow-hidden z-10
                    ${dragActive
                        ? 'border-indigo-400 bg-indigo-50/50 scale-[1.02] shadow-inner'
                        : 'border-slate-200 bg-white/30 hover:bg-white/50 hover:border-slate-300 hover:scale-[1.01] hover:shadow-xl'}
                    ${localError || error ? 'border-red-200 bg-red-50/30' : ''}`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                onClick={() => !isUploading && fileInputRef.current?.click()}
            >
                <input
                    ref={fileInputRef}
                    className="hidden"
                    type="file"
                    accept={acceptedFileTypes}
                    onChange={handleChange}
                    disabled={isUploading}
                />

                <AnimatePresence mode='wait'>
                    {selectedFile ? (
                        <motion.div
                            key="file-preview"
                            initial={{ opacity: 0, scale: 0.9, y: 10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: -10 }}
                            className="flex flex-col items-center justify-center p-6 text-center w-full h-full"
                        >
                            <div className="w-20 h-20 mb-4 rounded-3xl bg-indigo-600 shadow-2xl shadow-indigo-200 flex items-center justify-center text-white transform rotate-3 hover:rotate-0 transition-transform duration-500">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                            </div>
                            <p className="text-base font-bold text-slate-800 truncate max-w-[85%] mb-1">{selectedFile.name}</p>
                            <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>

                            <button
                                onClick={(e) => { e.stopPropagation(); handleClear(); }}
                                className="mt-4 text-xs font-bold text-red-500 hover:text-red-600 underline underline-offset-4 decoration-red-200"
                            >
                                Remove file
                            </button>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="empty-state"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="flex flex-col items-center justify-center p-6 text-center"
                        >
                            <div className={`w-16 h-16 mb-4 rounded-2xl flex items-center justify-center transition-colors duration-500 ${dragActive ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-200' : 'bg-slate-100 text-slate-400'}`}>
                                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
                                </svg>
                            </div>
                            <p className="mb-2 text-base text-slate-700 font-semibold italic"><span className="text-indigo-600 not-italic">Choose a file</span> or drag it here</p>
                            <p className="text-xs text-slate-400 font-medium tracking-wide">{acceptedFileTypes.split(',')[0].toUpperCase()} • UP TO {maxSizeInMB}MB</p>
                        </motion.div>
                    )}
                </AnimatePresence>

                {isUploading && (
                    <motion.div
                        className="absolute inset-0 bg-white/90 backdrop-blur-md flex items-center justify-center z-20 p-8"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                    >
                        <div className="w-full text-center">
                            <div className="flex justify-between items-end mb-3">
                                <div className="text-left">
                                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-1">Status</span>
                                    <span className="text-base font-bold text-indigo-600">Uploading Assets...</span>
                                </div>
                                <span className="text-2xl font-black text-indigo-600 tracking-tighter">{Math.round(progress)}%</span>
                            </div>
                            <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden shadow-inner">
                                <motion.div
                                    className="bg-linear-to-r from-indigo-500 via-purple-500 to-indigo-600 h-full rounded-full"
                                    initial={{ width: 0 }}
                                    animate={{ width: `${progress}%` }}
                                    transition={{ duration: 0.5 }}
                                ></motion.div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </div>

            {(localError || error) && (
                <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    className="mt-4 p-4 rounded-2xl bg-red-50 border border-red-100 text-sm text-red-600 font-semibold flex items-start z-10 relative"
                >
                    <svg className="w-5 h-5 mr-3 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                    {localError || error}
                </motion.div>
            )}

            <div className="mt-8 flex gap-4 justify-end relative z-10">
                <button
                    onClick={() => {
                        handleClear();
                        onHandleClose();
                    }}
                    disabled={isUploading}
                    className="px-6 py-3 text-sm font-bold text-slate-500 hover:text-slate-700 hover:bg-slate-50 rounded-2xl transition-all disabled:opacity-30"
                >
                    Dismiss
                </button>
                <button
                    onClick={() => handleUploadClick(nameFromInput)}
                    disabled={isUploading || !selectedFile}
                    className="px-8 py-3 text-sm font-bold text-white bg-linear-to-r from-indigo-600 to-indigo-700 rounded-2xl hover:shadow-2xl hover:shadow-indigo-200 transition-all hover:-translate-y-1 active:scale-95 disabled:opacity-50 disabled:translate-y-0 disabled:shadow-none shadow-xl shadow-indigo-100"
                >
                    {isUploading ? (
                        <div className="flex items-center gap-2">
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                            Processing...
                        </div>
                    ) : 'Upload Now'}
                </button>
            </div>
        </div>
    );
};

export default MinIOUploadComponent;
