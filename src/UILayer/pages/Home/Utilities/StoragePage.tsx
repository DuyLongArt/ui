import React, { useState, useRef, useEffect } from 'react';
import {
    Card,
    CardBody,
    Typography,
    Button,
    Progress,
    IconButton
} from "@material-tailwind/react";
import {
    CloudArrowUpIcon,
    DocumentIcon,
    PhotoIcon,
    XMarkIcon,
    TrashIcon,
    ArrowLeftIcon
} from "@heroicons/react/24/solid";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

interface FileUpload {
    id: string;
    file: File;
    preview: string | undefined;
    progress: number;
    status: 'pending' | 'uploading' | 'completed' | 'error';
    url?: string;
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
        <div>
            <button
                onClick={() => navigator("/utilities/index/storage")}
            >Storage</button>
        </div>
    );
};

const StoragePage = () => {
    const navigate = useNavigate();
    const [files, setFiles] = useState<FileUpload[]>([]);
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const fetchFiles = async () => {
        try {
            const response = await axios.get('/backend/object/all');
            const mappedFiles: FileUpload[] = response.data.map((file: any) => ({
                id: file.id || Math.random().toString(36).substr(2, 9),
                file: new File([], file.fileName),
                preview: file.contentType?.startsWith('image/') ? `/object/duylongwebappobjectdatabase/${file.fileName}` : undefined,
                progress: 100,
                status: 'completed',
                url: `/object/duylongwebappobjectdatabase/${file.fileName}`
            }));
            setFiles(mappedFiles);
        } catch (error) {
            console.error("❌ Failed to fetch files:", error);
        }
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
            status: 'pending'
        }));
        setFiles(prev => [...fileWrappers, ...prev]);
    };

    const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            processFiles(Array.from(event.target.files));
        }
    };

    const onDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const onDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const onDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        if (e.dataTransfer.files) {
            processFiles(Array.from(e.dataTransfer.files));
        }
    };

    const removeFile = (id: string) => {
        setFiles(prev => prev.filter(f => f.id !== id));
    };

    const handleUploadAll = async () => {
        const pendingFiles = files.filter(f => f.status === 'pending' || f.status === 'error');

        for (const fileWrapper of pendingFiles) {
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

                setFiles(prev => prev.map(f =>
                    f.id === fileWrapper.id ? { ...f, status: 'completed', progress: 100 } : f
                ));
            } catch (error) {
                console.error("❌ Upload failed:", error);
                setFiles(prev => prev.map(f =>
                    f.id === fileWrapper.id ? { ...f, status: 'error', progress: 0 } : f
                ));
            }
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'completed': return 'text-green-500 font-bold';
            case 'error': return 'text-red-500 font-bold';
            case 'uploading': return 'text-blue-500 font-bold';
            default: return 'text-gray-500';
        }
    };

    return (
        <div className="p-6 md:p-10 w-full border-2 border-b-blue-400 max-w-6xl mx-auto">
            <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <div className="font-bold text-3xl text-slate-800 tracking-tight">
                        Storage & Assets
                    </div>
                    <div className="text-slate-500 font-medium">
                        Manage your cloud files and upload new assets.
                    </div>
                </div>
                <Button
                    variant="text"
                    color="blue-gray"
                    onClick={() => navigate('/utilities/index/dashboard')}
                    className="flex items-center gap-2 font-bold"
                    {...commonProps}
                >
                    <ArrowLeftIcon strokeWidth={2} className="h-4 w-4" /> Back to Utilities
                </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <Card className="lg:col-span-2 h-fit shadow-lg" {...commonProps}>
                    <CardBody {...commonProps}>
                        <div
                            onDragOver={onDragOver}
                            onDragLeave={onDragLeave}
                            onDrop={onDrop}
                            onClick={() => fileInputRef.current?.click()}
                            className={`
                                border-2 border-dashed rounded-xl p-10 flex flex-col items-center justify-center cursor-pointer transition-all duration-300
                                ${isDragging ? 'border-blue-500 bg-blue-50 scale-[1.02]' : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50'}
                            `}
                        >
                            <input
                                type="file"
                                multiple
                                className="hidden"
                                ref={fileInputRef}
                                onChange={handleFileSelect}
                            />
                            <div className={`p-4 rounded-full mb-4 ${isDragging ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-500'}`}>
                                <CloudArrowUpIcon className="h-10 w-10" />
                            </div>
                            <Typography variant="h5" color="blue-gray" className="font-bold" {...commonProps}>
                                Click or Drop files here
                            </Typography>
                            <Typography color="gray" className="text-sm mt-2 text-center" {...commonProps}>
                                Support for JPG, PNG, PDF (Max 10MB)
                            </Typography>
                        </div>

                        {files.length > 0 && (
                            <div className="mt-8 flex flex-col gap-4">
                                <div className="flex justify-between items-center">
                                    <Typography variant="h6" color="blue-gray" {...commonProps}>
                                        Files ({files.length})
                                    </Typography>
                                    <Button size="sm" color="red" variant="text" onClick={() => setFiles([])} {...commonProps}>
                                        Clear All
                                    </Button>
                                </div>

                                <div className="flex flex-col gap-3 max-h-[400px] overflow-y-auto pr-2">
                                    {files.map((item) => (
                                        <div key={item.id} className="flex items-center gap-4 p-3 border border-gray-100 rounded-lg hover:shadow-sm transition-shadow bg-white">
                                            <div className="h-12 w-12 rounded-lg bg-gray-100 overflow-hidden flex items-center justify-center flex-shrink-0">
                                                {item.preview ? (
                                                    <img src={item.preview} alt="preview" className="h-full w-full object-cover" />
                                                ) : (
                                                    <DocumentIcon className="h-6 w-6 text-gray-500" />
                                                )}
                                            </div>

                                            <div className="flex-1 min-w-0">
                                                <div className="flex justify-between mb-1">
                                                    <Typography variant="small" className="font-medium truncate text-gray-900" {...commonProps}>
                                                        {item.file.name}
                                                    </Typography>
                                                    <Typography variant="small" className={getStatusColor(item.status)} {...commonProps}>
                                                        {item.status === 'uploading' ? `${item.progress}%` : item.status}
                                                    </Typography>
                                                </div>
                                                <Progress
                                                    value={item.progress}
                                                    size="sm"
                                                    color={item.status === 'error' ? "red" : item.status === 'completed' ? "green" : "blue"}
                                                    {...commonProps}
                                                />
                                            </div>

                                            <IconButton variant="text" color="blue-gray" onClick={() => removeFile(item.id)} {...commonProps}>
                                                <XMarkIcon className="h-5 w-5" />
                                            </IconButton>
                                        </div>
                                    ))}
                                </div>

                                <div className="mt-4 flex justify-end">
                                    <Button onClick={handleUploadAll} color="blue" disabled={files.every(f => f.status === 'completed')} {...commonProps}>
                                        Upload {files.filter(f => f.status === 'pending').length} Files
                                    </Button>
                                </div>
                            </div>
                        )}
                    </CardBody>
                </Card>

                <div className="flex flex-col gap-6">
                    <StorageStatsCard />
                    <RecentFilesCard />
                </div>
            </div>
        </div>
    );
};

const StorageStatsCard = () => (
    <Card className="shadow-lg bg-gradient-to-br from-blue-900 to-blue-800 text-white" {...commonProps}>
        <CardBody {...commonProps}>
            <div className="flex items-start justify-between mb-4">
                <div>
                    <Typography variant="h5" className="mb-1" {...commonProps}>Storage Usage</Typography>
                    <Typography className="text-blue-200 text-sm" {...commonProps}>75% of 100GB Used</Typography>
                </div>
                <div className="p-2 bg-blue-700 rounded-lg">
                    <CloudArrowUpIcon className="h-6 w-6 text-white" />
                </div>
            </div>
            <Progress value={75} color="white" className="bg-blue-900/50 mb-4" {...commonProps} />
            <div className="grid grid-cols-2 gap-4 text-center">
                <div className="p-3 bg-blue-700/30 rounded-lg">
                    <Typography variant="h4" {...commonProps}>1200</Typography>
                    <Typography className="text-xs text-blue-200" {...commonProps}>Images</Typography>
                </div>
                <div className="p-3 bg-blue-700/30 rounded-lg">
                    <Typography variant="h4" {...commonProps}>350</Typography>
                    <Typography className="text-xs text-blue-200" {...commonProps}>Documents</Typography>
                </div>
            </div>
        </CardBody>
    </Card>
);

const RecentFilesCard = () => (
    <Card className="shadow-lg border border-gray-100" {...commonProps}>
        <CardBody {...commonProps}>
            <Typography variant="h6" color="blue-gray" className="mb-4" {...commonProps}>Recent Uploads</Typography>
            <ul className="flex flex-col gap-3">
                {[1, 2, 3].map((_, i) => (
                    <li key={i} className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-md transition-colors cursor-pointer">
                        <div className="p-2 bg-purple-50 rounded-md text-purple-500">
                            <PhotoIcon className="h-5 w-5" />
                        </div>
                        <div className="flex-1">
                            <Typography variant="small" className="font-medium text-gray-900" {...commonProps}>file_{i}.jpg</Typography>
                            <Typography variant="small" className="text-xs text-gray-500" {...commonProps}>2.4 MB • 2 hours ago</Typography>
                        </div>
                    </li>
                ))}
            </ul>
        </CardBody>
    </Card>
);

export { StoragePage, StoragePageIcon };
export default StoragePage;