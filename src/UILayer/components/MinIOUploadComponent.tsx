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
        <div className="w-full max-w-md mx-auto p-6 bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="mb-4">
                <h3 className="text-lg font-semibold text-black">Upload File</h3>
                <p className="text-sm text-black">Attach your documents or images here</p>
            </div>

            <div
                className={`relative flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-lg transition-colors duration-200 ease-in-out cursor-pointer overflow-hidden
                    ${dragActive ? 'border-indigo-500 bg-indigo-50' : 'border-gray-300 bg-gray-50 hover:bg-gray-100'}
                    ${localError || error ? 'border-red-300 bg-red-50' : ''}`}
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
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="flex flex-col items-center justify-center p-4 text-center w-full h-full z-10"
                        >
                            <div className="w-12 h-12 mb-3 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                            </div>
                            <p className="text-sm font-medium text-white truncate max-w-[90%]">{selectedFile.name}</p>
                            <p className="text-xs text-white">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="empty-state"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="flex flex-col items-center justify-center p-4 text-center"
                        >
                            <svg className={`w-10 h-10 mb-3 ${dragActive ? 'text-indigo-500' : 'text-black'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
                            </svg>
                            <p className="mb-2 text-sm text-black"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                            <p className="text-xs text-black">SVG, PNG, JPG or PDF (MAX. {maxSizeInMB}MB)</p>
                        </motion.div>
                    )}
                </AnimatePresence>

                {isUploading && (
                    <motion.div
                        className="absolute inset-0 bg-white/80 flex items-center justify-center z-20"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                    >
                        <div className="w-full max-w-[80%]">
                            <div className="flex justify-between mb-1">
                                <span className="text-xs font-medium text-indigo-700">Uploading...</span>
                                <span className="text-xs font-medium text-indigo-700">{Math.round(progress)}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2.5">
                                <div className="bg-indigo-600 h-2.5 rounded-full transition-all duration-300" style={{ width: `${progress}%` }}></div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </div>

            {(localError || error) && (
                <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    className="mt-2 text-sm text-red-600 flex items-center"
                >
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                    {localError || error}
                </motion.div>
            )}

            <div className="mt-4 flex gap-3 justify-end">
                <button
                    onClick={handleClear}
                    disabled={isUploading || !selectedFile}
                    className="px-4 py-2 text-sm font-medium text-white bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                    Cancel
                </button>
                <button
                    onClick={() => handleUploadClick(nameFromInput)}
                    disabled={isUploading || !selectedFile}
                    className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-95"
                >
                    {isUploading ? 'Uploading...' : 'Submit!'}
                </button>
            </div>
        </div>
    );
};

export default MinIOUploadComponent;
