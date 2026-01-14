
import React, { useState, useEffect } from 'react';
import { CameraIcon, PencilIcon, PlusIcon, ShieldCheckIcon, XMarkIcon, CheckCircleIcon, ArrowLeftOnRectangleIcon, EnvelopeIcon, PhoneIcon } from '@heroicons/react/24/solid';
import { MapPinIcon, AcademicCapIcon, ComputerDesktopIcon, HomeIcon, PhotoIcon as PhotographIcon, UsersIcon, ChatBubbleOvalLeftIcon as ChatIcon, BellIcon } from '@heroicons/react/24/outline';
import { useUserAccountStore, useUserProfileStore } from '../../../OrchestraLayer/StateManager/Zustand/userProfileStore';
import { Activity, Eye, TrendingUp, Users } from 'lucide-react';
import { AuthenticateFactor } from '../../../OrchestraLayer/StateManager/XState/AuthenticateMachine';
import MinIOUploadComponent from '../../components/MinIOUploadComponent';
import { useActor } from '@xstate/react';
import { EditAdminProfileMachine } from '../../../OrchestraLayer/StateManager/XState/EditAdminProfileMachine';
import { motion, AnimatePresence } from 'framer-motion';
import { useObjectImageEtagStore } from '../../../OrchestraLayer/StateManager/Zustand/objectImageStore';
import editAdminInformationMachine from '../../../OrchestraLayer/StateManager/XState/EditAdminInformation';
import { GlassCard } from '../Home/Person/GlassContainer';
import { Typography } from "@material-tailwind/react";

// useUserAccountStore
import axios from 'axios';


const PersonProfilePage: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'Posts' | 'About' | 'Photos' | 'Security' | 'Contact'>('Posts');
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: '',
    });

    const handleContactChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleContactSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Form data submitted:', formData);
        alert('Thank you for your message!');
    };
    const user = useUserProfileStore((state) => state.information);
    const updateProfileImageUrl = useUserProfileStore((state) => state.updateProfileImageUrl);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [mode, setMode] = useState('');
    const [nameFromInput, setNameFromInput] = useState('');
    const actorRef = AuthenticateFactor.useActorRef();
    const [state, send] = useActor(EditAdminProfileMachine);
    const imageObjectStore = useObjectImageEtagStore();

    const [location, setLocation] = useState('');
    const [university, setUniversity] = useState('');
    const userAccountStore = useUserAccountStore();
    const [editAdminInformationState, editAdminInformationSend] = useActor(editAdminInformationMachine);

    // Common props to fix TS errors with Material Tailwind
    const commonProps = {
        placeholder: undefined,
        onPointerEnterCapture: undefined,
        onPointerLeaveCapture: undefined,
        onResize: undefined,
        onResizeCapture: undefined,
    } as any;

    const stats = [
        { label: "Profile Views", value: "2.4k", icon: <Eye size={20} />, color: "bg-blue-500", trend: "+12%" },
        { label: "Projects", value: "42", icon: <Activity size={20} />, color: "bg-purple-500", trend: "+5%" },
        { label: "Followers", value: "847", icon: <Users size={20} />, color: "bg-pink-500", trend: "+18%" },
        { label: "Engagement", value: "95%", icon: <TrendingUp size={20} />, color: "bg-green-500", trend: "+2%" },
    ];

    useEffect(() => {
        useUserProfileStore.getState().fetchFromDatabase();
        userAccountStore.getUserRole();
        if (state.matches('success')) {
            if (mode === 'admin') {
                imageObjectStore.incrementAvatarVersion();
            }
            if (mode === 'cover') {
                imageObjectStore.incrementCoverVersion();
            }
        }
    }, [state.value]);

    const ADMIN_IMAGE_URL = `/object/duylongwebappobjectdatabase/${user.profiles.alias}/admin.png?v=${imageObjectStore.versions.avatarVersion}`;
    const COVER_PHOTO_URL = `/object/duylongwebappobjectdatabase/${user.profiles.alias}/cover.png?v=${imageObjectStore.versions.coverVersion}`;
    const [profileBlobUrl, setProfileBlobUrl] = useState<string>('');
    const [coverBlobUrl, setCoverBlobUrl] = useState<string>('');

    // Fetch Image via Axios
    useEffect(() => {
        let profileUrl = '';
        let coverUrl = '';

        const loadImage = async (url: string, setter: (val: string) => void) => {
            if (!user.profiles.alias) return;
            try {
                const response = await axios.get(url, { responseType: 'blob' });
                const localUrl = URL.createObjectURL(response.data);
                setter(localUrl);
                return localUrl;
            } catch (err) {
                console.error("Lỗi tải ảnh qua Proxy:", err);
                setter(url); // Fallback dùng link trực tiếp nếu axios lỗi
            }
        };

        const loadAll = async () => {
            profileUrl = await loadImage(ADMIN_IMAGE_URL, setProfileBlobUrl) || '';
            coverUrl = await loadImage(COVER_PHOTO_URL, setCoverBlobUrl) || '';
        };

        loadAll();

        return () => {
            if (profileUrl) URL.revokeObjectURL(profileUrl);
            if (coverUrl) URL.revokeObjectURL(coverUrl);
        };
    }, [user.profiles.alias, imageObjectStore.versions.avatarVersion, imageObjectStore.versions.coverVersion]);
    const handleUploadStart = (file: File) => {
        send({ type: 'FILE_SELECTED', file, name: 'profileImage' });
        send({ type: 'UPLOAD_STARTED' });
    };

    const handleCloseModal = () => {
        setIsEditModalOpen(false);
        send({ type: 'RESET' });
    };

    const handleLogout = () => {
        console.log("👋 Initiating logout...");
        actorRef.send({ type: 'LOGOUT' });
    };

    // Sync uploaded URL with Zustand store
    useEffect(() => {
        if (state.matches('success') && state.context.uploadedUrl) {
            updateProfileImageUrl(state.context.uploadedUrl);
            console.log("🔄 Updated store with new profile image URL:", state.context.uploadedUrl);
        }
    }, [state.matches('success'), state.context.uploadedUrl, updateProfileImageUrl]);

    return (
        <div className="bg-white min-h-screen pb-20 animate-fade-in-up">
            <GlassCard className="max-w-5xl mx-auto shadow-xl overflow-hidden mb-6">
                {/* Cover Image */}
                <div className="relative h-[250px] md:h-[350px] bg-gray-200">
                    <img src={coverBlobUrl} alt="Cover" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent"></div>

                    <button
                        className="absolute bottom-4 right-4 bg-white/20 backdrop-blur-md border border-white/40 text-white font-bold py-2 px-4 rounded-xl flex items-center hover:bg-white/30 transition-all shadow-lg text-sm"
                        onClick={() => { setMode('cover'); setIsEditModalOpen(true); }}
                    >
                        <CameraIcon className="h-4 w-4 mr-2" />
                        Edit Cover
                    </button>
                </div>

                {/* Profile Header */}
                <div className="relative px-8 pb-8">
                    <div className="flex flex-col md:flex-row items-end -mt-[70px] mb-6">
                        {/* Avatar */}
                        <div className="relative group cursor-pointer" onClick={() => { setMode('admin'); setIsEditModalOpen(true); }}>
                            <div className="w-[140px] h-[140px] md:w-[180px] md:h-[180px] rounded-full border-4 border-white shadow-2xl overflow-hidden bg-white ring-4 ring-white/50">
                                <img src={profileBlobUrl} alt="Profile" className="w-full h-full object-cover" />
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-300">
                                    <CameraIcon className="w-8 h-8 text-white" />
                                </div>
                            </div>
                            <div className="absolute bottom-5 right-5 h-5 w-5 bg-green-500 rounded-full border-4 border-white shadow-md"></div>
                        </div>

                        {/* Info */}
                        <div className="mt-4 md:mt-0 md:ml-6 flex-1 text-center md:text-left">
                            <Typography variant="h2" className="text-3xl font-extrabold text-white" {...commonProps}>
                                {user.profiles.firstName} {user.profiles.lastName}
                            </Typography>
                            <Typography className="text-white font-medium mb-3" {...commonProps}>
                                {user.profiles.friends.toLocaleString()} friends • {user.profiles.mutual} mutual
                            </Typography>
                            {/* {}USER ROLE */}
                            <div className="flex flex-wrap justify-center md:justify-start gap-2 mb-4 md:mb-0">
                                <span className="px-3 py-1 bg-indigo-100 text-indigo-700 text-md font-bold rounded-full border border-indigo-200 shadow-sm">{userAccountStore.account.role}</span>
                                {/* <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full border border-green-200 shadow-sm">ACTIVE</span> */}
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-3 mt-6 md:mt-0 w-full md:w-auto">
                            <button onClick={handleLogout} className="flex-1 md:flex-none flex items-center justify-center bg-white border border-red-200 text-red-600 hover:bg-red-50 font-bold py-2.5 px-5 rounded-xl transition-all shadow-sm text-sm">
                                <ArrowLeftOnRectangleIcon className="h-4 w-4 mr-2" /> Logout
                            </button>
                            <button className="flex-1 md:flex-none flex items-center justify-center bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2.5 px-5 rounded-xl transition-all shadow-lg shadow-indigo-200 text-sm">
                                <PlusIcon className="h-4 w-4 mr-2" /> Add Story
                            </button>
                            <button
                                onClick={() => {
                                    editAdminInformationSend({ type: "EDIT" });
                                    if (editAdminInformationState.value === "onEdit") editAdminInformationSend({ type: "TYPE" });
                                    if (editAdminInformationState.value === "onType") editAdminInformationSend({ type: "SAVE", location, university });
                                }}
                                className="flex-1 md:flex-none flex items-center justify-center bg-slate-100 hover:bg-slate-200 text-white font-bold py-2.5 px-5 rounded-xl transition-all shadow-sm text-sm"
                            >
                                <PencilIcon className="h-4 w-4 mr-2" /> Edit
                            </button>
                        </div>
                    </div>

                    {/* Bio */}
                    {user.details.bio && (
                        <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 text-black italic text-center md:text-left text-xl">
                            "{user.details.bio}"
                        </div>
                    )}
                </div>

                {/* Navigation Tabs */}
                <div className="flex px-8 border-t border-slate-100">
                    {['Posts', 'About', 'Photos', 'Security', 'Contact'].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab as any)}
                            className={`px-6 py-4 font-bold text-sm transition-all border-b-2 ${activeTab === tab
                                ? 'text-indigo-600 border-indigo-600 bg-indigo-50/50'
                                : 'text-white border-transparent hover:bg-slate-50 hover:text-white'
                                }`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>
            </GlassCard>

            {/* Content Layout */}
            <div className="max-w-5xl mx-auto px-4 md:px-0 flex flex-col md:flex-row gap-6">
                {/* Left Column */}
                <div className="w-full md:w-[350px] space-y-6">
                    {/* Intro Card */}
                    <GlassCard className="p-6">
                        <Typography variant="h5" className="font-bold text-white mb-4" {...commonProps}>Intro</Typography>
                        <div className="space-y-4">
                            <div className="flex items-center text-white">
                                <AcademicCapIcon className="h-5 w-5 text-white mr-3" />
                                {(editAdminInformationState.value !== "onEdit" && editAdminInformationState.value !== "onType")
                                    ? <span>Studied at <strong className="text-white">{user.details.university}</strong></span>
                                    : <input type="text" className="border rounded p-1 w-full text-sm" value={university} onChange={(e) => setUniversity(e.target.value)} />}
                            </div>
                            <div className="flex items-center text-white">
                                <MapPinIcon className="h-5 w-5 text-white mr-3" />
                                {(editAdminInformationState.value !== "onEdit" && editAdminInformationState.value !== "onType")
                                    ? <span>Lives in <strong className="text-white">{user.details.country}</strong></span>
                                    : <input type="text" className="border rounded p-1 w-full text-sm" value={location} onChange={(e) => setLocation(e.target.value)} />}
                            </div>
                            <div className="flex items-center text-white">
                                <ComputerDesktopIcon className="h-5 w-5 text-white mr-3" />
                                <span className="text-xs font-mono bg-slate-100 px-2 py-1 rounded">Reg IP: 192.168.22.4</span>
                            </div>
                        </div>
                        <button className="w-full mt-6 bg-slate-100 hover:bg-slate-200 text-white font-bold py-2 rounded-xl transition-colors text-sm">
                            Edit Public Details
                        </button>
                    </GlassCard>

                    {/* Admin Access */}
                    <GlassCard className="p-6 bg-indigo-50/50 border-indigo-100">
                        <div className="flex items-center mb-4">
                            <ShieldCheckIcon className="h-5 w-5 text-indigo-600 mr-2" />
                            <Typography variant="h6" className="font-bold text-indigo-900" {...commonProps}>Admin Control</Typography>
                        </div>
                        <div className="space-y-2">
                            <button className="w-full text-left p-2.5 rounded-lg bg-white border border-indigo-100 hover:shadow-md text-indigo-800 text-sm font-semibold transition-all">
                                View System Logs
                            </button>
                            <button className="w-full text-left p-2.5 rounded-lg bg-white border border-indigo-100 hover:shadow-md text-indigo-800 text-sm font-semibold transition-all">
                                Manage User Permissions
                            </button>
                        </div>
                    </GlassCard>
                </div>

                {/* Right Column (Tabs Content) */}
                <div className="flex-1 space-y-6">
                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                        {stats.map((stat, index) => (
                            <GlassCard key={index} className="p-4 hover:-translate-y-1 transition-transform duration-300">
                                <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-white mb-2 shadow-md ${stat.color}`}>
                                    {stat.icon}
                                </div>
                                <div>
                                    <Typography className="text-white text-xs font-bold uppercase tracking-wider" {...commonProps}>{stat.label}</Typography>
                                    <div className="flex items-end gap-1">
                                        <Typography variant="h5" className="text-white font-bold leading-none" {...commonProps}>{stat.value}</Typography>
                                        <span className="text-green-500 text-[10px] font-bold bg-green-50 px-1 rounded">{stat.trend}</span>
                                    </div>
                                </div>
                            </GlassCard>
                        ))}
                    </div>

                    {/* Tab Content Rendering */}
                    {activeTab === 'Security' && (
                        <GlassCard className="p-6">
                            <div className="flex items-center mb-6">
                                <div className="p-3 bg-indigo-100 rounded-full mr-4">
                                    <ShieldCheckIcon className="h-6 w-6 text-indigo-600" />
                                </div>
                                <div>
                                    <Typography variant="h5" className="font-bold text-white" {...commonProps}>Security Center</Typography>
                                    <Typography className="text-white text-sm" {...commonProps}>Manage your account security and authentication methods.</Typography>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="p-4 border border-slate-200 rounded-xl bg-slate-50/50">
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="font-semibold text-white">Two-Factor Authentication</span>
                                        <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-bold rounded">ENABLED</span>
                                    </div>
                                    <p className="text-sm text-white">Your account is protected with 2FA.</p>
                                </div>
                            </div>
                        </GlassCard>
                    )}

                    {activeTab === 'Posts' && (
                        <GlassCard className="p-12 flex flex-col items-center justify-center text-white min-h-[300px]">
                            <div className="p-4 bg-slate-100 rounded-full mb-4">
                                <ChatIcon className="h-8 w-8 text-white" />
                            </div>
                            <Typography variant="h6" className="font-bold text-white" {...commonProps}>No posts yet</Typography>
                            <Typography className="text-sm" {...commonProps}>Check back later for updates from the admin team.</Typography>
                        </GlassCard>
                    )}

                    {activeTab === 'Contact' && (
                        <div className="space-y-6">
                            <GlassCard className="p-8">
                                <Typography variant="h4" className="text-2xl font-bold text-white mb-2" {...commonProps}>Contact Us</Typography>
                                <Typography className="text-white mb-6" {...commonProps}>We'd love to hear from you! Please fill out the form below.</Typography>

                                <form onSubmit={handleContactSubmit} className="flex flex-col gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-white mb-1" htmlFor="name">Full Name</label>
                                        <input
                                            type="text"
                                            id="name"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleContactChange}
                                            required
                                            className="w-full px-4 py-3 rounded-lg bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all"
                                            placeholder="John Doe"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-white mb-1" htmlFor="email">Email Address</label>
                                        <input
                                            type="email"
                                            id="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleContactChange}
                                            required
                                            className="w-full px-4 py-3 rounded-lg bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all"
                                            placeholder="john@example.com"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-white mb-1" htmlFor="message">Your Message</label>
                                        <textarea
                                            id="message"
                                            name="message"
                                            value={formData.message}
                                            onChange={handleContactChange}
                                            required
                                            rows={5}
                                            className="w-full px-4 py-3 rounded-lg bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all resize-none"
                                            placeholder="Write your message here..."
                                        />
                                    </div>

                                    <button
                                        type="submit"
                                        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-lg shadow-lg transform transition-all hover:-translate-y-0.5"
                                    >
                                        Send Message
                                    </button>
                                </form>
                            </GlassCard>

                            <GlassCard className="bg-gradient-to-br from-indigo-600 to-purple-700 p-8 text-white">
                                <h3 className="text-2xl font-bold mb-6">Our Information</h3>
                                <div className="flex flex-col gap-6">

                                    <div className="flex items-start gap-4">
                                        <div className="p-3 bg-white/20 rounded-lg backdrop-blur-sm">
                                            <EnvelopeIcon className="h-6 w-6 text-white" />
                                        </div>
                                        <div>
                                            <p className="font-semibold text-white/90">Email</p>
                                            <p className="text-white/80">contact@example.com</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-4">
                                        <div className="p-3 bg-white/20 rounded-lg backdrop-blur-sm">
                                            <PhoneIcon className="h-6 w-6 text-white" />
                                        </div>
                                        <div>
                                            <p className="font-semibold text-white/90">Phone</p>
                                            <p className="text-white/80">+1 (234) 567-890</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-4">
                                        <div className="p-3 bg-white/20 rounded-lg backdrop-blur-sm">
                                            <MapPinIcon className="h-6 w-6 text-white" />
                                        </div>
                                        <div>
                                            <p className="font-semibold text-white/90">Address</p>
                                            <p className="text-white/80">123 Main Street<br />Anytown, USA</p>
                                        </div>
                                    </div>
                                </div>
                            </GlassCard>
                        </div>
                    )}

                </div>
            </div>

            {/* Mobile Footer Nav */}
            <footer className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-xl border-t border-slate-200 flex justify-around p-3 z-40 lg:hidden safe-area-bottom">
                <HomeIcon className="h-6 w-6 text-indigo-600" />
                <PhotographIcon className="h-6 w-6 text-white" />
                <UsersIcon className="h-6 w-6 text-white" />
                <BellIcon className="h-6 w-6 text-white" />
            </footer>

            {/* Edit Modal */}
            <AnimatePresence>
                {isEditModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden border border-slate-100"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="flex justify-between items-center p-5 border-b border-slate-100">
                                <h2 className="text-xl font-bold text-black">Change {mode === 'cover' ? 'Cover' : 'Profile'} Photo</h2>
                                <button onClick={handleCloseModal} className="p-2 rounded-full hover:bg-slate-100 text-white transition-all">
                                    <XMarkIcon className="w-5 h-5" />
                                </button>
                            </div>

                            <div className="p-6 border-b border-slate-100 shadow-2xl">
                                <input
                                    className="w-full p-2 m-2 border border-slate-300 rounded-xl mb-6 text-black focus:ring-2 focus:ring-indigo-500 outline-none"
                                    placeholder="Enter file name (optional)"
                                    type="text" value={nameFromInput} onChange={(e) => setNameFromInput(e.target.value)}
                                />

                                <MinIOUploadComponent
                                    onUpload={mode === 'cover' ? (f) => send({ type: 'FILE_SELECTED', file: f, name: 'profileImage' }) : handleUploadStart}
                                    progress={state.context.progress}
                                    isUploading={state.matches('uploading')}
                                    error={state.context.error}
                                    nameFromInput={nameFromInput}
                                    mode={mode}
                                />

                                {state.matches('success') && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        className="mt-6 p-4 bg-green-50 text-green-700 rounded-xl flex items-center border border-green-100"
                                    >
                                        <CheckCircleIcon className="w-5 h-5 mr-3" />
                                        <span className="font-semibold text-sm">Upload successful!</span>
                                    </motion.div>
                                )}
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default PersonProfilePage;
