import React, { useState, useRef, useEffect } from 'react';
import {
    Card,
    CardBody,
    Typography,
    Progress,
    IconButton,
    Input,
    Button
} from "@material-tailwind/react";
import {
    Search,
    Cloud,
    Folder,
    MoreVertical,
    FileText,
    Image as ImageIcon,
    Briefcase,
    Plus,
    X,
    CheckCircle,
    AlertCircle,
    ArrowLeft
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import PersonProfileIcon from "../../../components/PersonProfileIcon";
import { useTruenasStorageStore } from '@/OrchestraLayer/StateManager/Zustand/truenasStorageStore';

interface FileUpload {
    id: string;
    file: File;
    preview: string | undefined;
    progress: number;
    status: 'pending' | 'uploading' | 'completed' | 'error';
    url?: string;
    type?: string;
    date?: string;
    size?: string;
}

const commonProps = {
    placeholder: undefined,
    onPointerEnterCapture: undefined,
    onPointerLeaveCapture: undefined,
    onResize: undefined,
    onResizeCapture: undefined,
} as any;

const StoragePageIcon = () => {
    const navigator = useNavigate();
    return (
        <div onClick={() => navigator("/utilities/index/storage")} className="cursor-pointer">
            <Typography {...commonProps}>Storage</Typography>
        </div>
    );
};

const StoragePage = () => {
    const navigate = useNavigate();
    const [files, setFiles] = useState<FileUpload[]>([]);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [searchQuery, setSearchQuery] = useState("");
    const { pools, percentageUsed, setPercentage } = useTruenasStorageStore();
    useEffect(() => {
        // getPools();
        setPercentage();
    }, []);
    console.log("+===============")
    console.log(pools)

    // Statistics state
    const totalStorage = pools[0].size;
    // const [usedStorage, setUsedStorage] = useState(percentageUsed);
    const [counts, setCounts] = useState({ images: 0, documents: 0, work: 0 });

    const fetchFiles = async () => {
        try {
            const response = await axios.get('/backend/object/all');
            const data = Array.isArray(response.data) ? response.data : [];
            const mappedFiles: FileUpload[] = data.map((file: any) => ({
                id: file.id || Math.random().toString(36).substr(2, 9),
                file: new File([], file.fileName),
                preview: file.contentType?.startsWith('image/') ? `/object/duylongwebappobjectdatabase/${file.fileName}` : undefined,
                progress: 100,
                status: 'completed',
                url: `/object/duylongwebappobjectdatabase/${file.fileName}`,
                type: file.contentType,
                date: "2 hours ago", // Placeholder
                size: "2.4 MB" // Placeholder
            }));
            setFiles(mappedFiles);
            calculateStats(mappedFiles);
        } catch (error) {
            console.error("❌ Failed to fetch files:", error);
        }
    };

    const calculateStats = (fileList: FileUpload[]) => {
        let img = 0;
        let doc = 0;
        let other = 0;
        fileList.forEach(f => {
            if (f.type?.startsWith('image/')) img++;
            else if (f.type?.startsWith('text/') || f.type?.includes('pdf')) doc++;
            else other++;
        });
        setCounts({ images: img, documents: doc, work: other });
        // Mock storage usage update
        // setUsedStorage(75.0 + (fileList.length * 0.01));

    };

    useEffect(() => {
        fetchFiles();
    }, []);

    const processFiles = (newFiles: File[]) => {
        const fileWrappers: FileUpload[] = newFiles.map(file => ({
            id: Math.random().toString(36).substr(2, 9),
            file,
            preview: file.type.startsWith('image/') ? URL.createObjectURL(file) : undefined,
            progress: 0,
            status: 'pending',
            type: file.type,
            date: "Just now",
            size: (file.size / (1024 * 1024)).toFixed(1) + " MB"
        }));
        setFiles(prev => [...fileWrappers, ...prev]);
        handleUpload(fileWrappers);
    };

    const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            processFiles(Array.from(event.target.files));
        }
        // Reset input
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const handleUpload = async (uploadFiles: FileUpload[]) => {
        for (const fileWrapper of uploadFiles) {
            setFiles(prev => prev.map(f => f.id === fileWrapper.id ? { ...f, status: 'uploading' } : f));

            const formData = new FormData();
            formData.append('file', fileWrapper.file);

            try {
                await axios.post('/backend/object/add', formData, {
                    onUploadProgress: (progressEvent) => {
                        const percent = Math.round((progressEvent.loaded * 100) / (progressEvent.total || 100));
                        setFiles(prev => prev.map(f => f.id === fileWrapper.id ? { ...f, progress: percent } : f));
                    }
                });

                setFiles(prev => {
                    const updated = prev.map(f =>
                        f.id === fileWrapper.id ? { ...f, status: 'completed' as const, progress: 100 } : f
                    );
                    calculateStats(updated);
                    return updated;
                });
            } catch (error) {
                console.error("❌ Upload failed:", error);
                setFiles(prev => prev.map(f =>
                    f.id === fileWrapper.id ? { ...f, status: 'error' as const, progress: 0 } : f
                ));
            }
        }
    };

    const filteredFiles = files.filter(f =>
        f.file.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-gray-50/50 p-4 pb-20 md:p-8 font-sans">
            <div className="max-w-4xl mx-auto space-y-8">

                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <Typography variant="h3" className="font-bold text-slate-800" {...commonProps}>
                            Storage & Assets
                        </Typography>
                    </div>

                    {/* <div className="hover:opacity-80 transition-opacity cursor-pointer p-1 rounded-full hover:bg-black/5">
                        <PersonProfileIcon onClick={() => navigate("/admin/person-profile")} />
                    </div> */}
                </div>

                {/* Search Bar */}
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search className="h-5 w-5 text-slate-400" />
                    </div>
                    <input
                        type="text"
                        className="block w-full pl-10 pr-3 py-3 border-none rounded-2xl bg-white shadow-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                        placeholder="Search your files..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>

                {/* Storage Usage Card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="rounded-3xl p-6 text-white shadow-lg bg-linear-to-r from-blue-600 to-indigo-600 relative overflow-hidden"
                >
                    {/* Background decoration */}
                    <div className="absolute top-0 right-0 p-4 opacity-10">
                        <Cloud size={100} />
                    </div>

                    <div className="relative z-10">
                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <Typography variant="small" className="opacity-80 font-medium mb-1" {...commonProps}>STORAGE USAGE</Typography>
                                <Typography variant="h3" className="font-bold" {...commonProps}>{(pools[0].allocated / 1024 / 1024 / 1024).toFixed(1)} GB used</Typography>
                            </div>
                            <div className="bg-white/20 p-2 rounded-xl backdrop-blur-sm">
                                <Cloud className="text-white h-6 w-6" />
                            </div>
                        </div>

                        <div className="w-full bg-black/20 rounded-full h-2 mb-2 overflow-hidden">
                            <div
                                className="bg-white h-2 rounded-full transition-all duration-1000 ease-out"
                                style={{ width: `${(percentageUsed[0]) * 100}%` }}
                            />
                        </div>
                        <Typography variant="small" className="opacity-80" {...commonProps}>
                            {Math.round((percentageUsed[0]) * 100)}% of {(pools[0].size / 1024 / 1024 / 1024).toFixed(1)}GB total storage used
                        </Typography>
                    </div>
                </motion.div>

                {/* Folders Section */}
                <div>
                    <div className="flex justify-between items-center mb-4">
                        <Typography variant="h5" className="font-bold text-slate-800" {...commonProps}>Folders</Typography>
                        <Button variant="text" color="blue" className="normal-case font-medium" {...commonProps}>View All</Button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                        <FolderCard
                            icon={<ImageIcon className="text-amber-500" size={24} />}
                            title="Images"
                            count={`${counts.images} files`}
                            color="bg-amber-100"
                        />
                        <FolderCard
                            icon={<FileText className="text-blue-500" size={24} />}
                            title="Documents"
                            count={`${counts.documents} files`}
                            color="bg-blue-100"
                        />
                        <FolderCard
                            icon={<Briefcase className="text-purple-500" size={24} />}
                            title="Work"
                            count={`${counts.work} files`}
                            color="bg-purple-100"
                        />
                    </div>
                </div>

                {/* Recent Files Section */}
                <div>
                    <div className="flex justify-between items-center mb-4">
                        <Typography variant="h5" className="font-bold text-slate-800" {...commonProps}>Recent Files</Typography>
                        <IconButton variant="text" color="blue-gray" size="sm" {...commonProps}>
                            <MoreVertical size={20} className="text-slate-600" />
                        </IconButton>
                    </div>

                    <div className="space-y-3">
                        {filteredFiles.length === 0 ? (
                            <div className="text-center py-10 text-slate-500">No files found</div>
                        ) : (
                            filteredFiles.map((file, index) => (
                                <motion.div
                                    key={file.id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                    className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4 hover:shadow-md transition-shadow cursor-pointer group"
                                >
                                    <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center shrink-0 overflow-hidden">
                                        {file.preview ? (
                                            <img src={file.preview} alt="preview" className="w-full h-full object-cover" />
                                        ) : (
                                            <FileText className="text-indigo-500" size={24} />
                                        )}
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <Typography variant="h6" className="text-sm font-bold text-slate-800 truncate" {...commonProps}>
                                            {file.file.name}
                                        </Typography>
                                        <div className="flex items-center gap-2 text-xs text-slate-500">
                                            <span>{file.size}</span>
                                            <span>•</span>
                                            <span>{file.date}</span>
                                            {file.status === 'uploading' && <span className="text-blue-500 font-bold ml-2">Uploading {file.progress}%</span>}
                                            {file.status === 'error' && <span className="text-red-500 font-bold ml-2">Error</span>}
                                        </div>
                                    </div>

                                    <IconButton variant="text" color="white" className="opacity-0 group-hover:opacity-100 transition-opacity" {...commonProps}>
                                        <MoreVertical size={20} />
                                    </IconButton>
                                </motion.div>
                            ))
                        )}
                    </div>
                </div>

            </div>

            {/* Floating Action Button */}
            <div className="fixed bottom-8 right-8 z-50">
                <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => fileInputRef.current?.click()}
                    className="w-16 h-16 bg-blue-600 rounded-full shadow-lg shadow-blue-600/30 flex items-center justify-center text-white"
                >
                    <Plus size={32} />
                </motion.button>
                <input
                    type="file"
                    multiple
                    className="hidden"
                    ref={fileInputRef}
                    onChange={handleFileSelect}
                />
            </div>
        </div>
    );
};

const FolderCard = ({ icon, title, count, color }: { icon: React.ReactNode, title: string, count: string, color: string }) => (
    <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-start gap-4 hover:shadow-md transition-shadow cursor-pointer">
        <div className={`p-3 rounded-xl ${color}`}>
            {icon}
        </div>
        <div>
            <Typography variant="h6" className="font-bold text-slate-800" {...commonProps}>{title}</Typography>
            <Typography className="text-xs text-slate-500 font-medium" {...commonProps}>{count}</Typography>
        </div>
    </div>
);

export { StoragePage, StoragePageIcon };
export default StoragePage;