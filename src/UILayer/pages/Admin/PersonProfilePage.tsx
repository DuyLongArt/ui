
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { CameraIcon, PencilIcon, PlusIcon, ShieldCheckIcon, XMarkIcon, CheckCircleIcon, ArrowLeftOnRectangleIcon, EnvelopeIcon, PhoneIcon } from '@heroicons/react/24/solid';
import { MapPinIcon, AcademicCapIcon, ComputerDesktopIcon, HomeIcon, PhotoIcon as PhotographIcon, UsersIcon, ChatBubbleOvalLeftIcon as ChatIcon, BellIcon } from '@heroicons/react/24/outline';
import { useUserAccountStore, useUserProfileStore } from '../../../OrchestraLayer/StateManager/Zustand/userProfileStore';
import { Activity, Eye, TrendingUp, Users, Footprints, Heart, Flame, Moon } from 'lucide-react';
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
import { usePersonInformationQuery, useInformationDetailsQuery } from '../../../DataLayer/APILayer/userQueries';


const PersonProfilePage: React.FC = () => {
    const { alias } = useParams<{ alias: string }>();
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
    const updateCoverImageUrl = useUserProfileStore((state) => state.updateCoverImageUrl);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [mode, setMode] = useState('');
    const [nameFromInput, setNameFromInput] = useState('');
    const actorRef = AuthenticateFactor.useActorRef();
    const [state, send] = useActor(EditAdminProfileMachine);
    const imageObjectStore = useObjectImageEtagStore();

    const [location, setLocation] = useState('');
    const [university, setUniversity] = useState('');
    const userAccountStore = useUserAccountStore();
    const userStore = useUserProfileStore();

    // Fetch data for the specific alias if provided, otherwise 'me'
    const { data: personData } = usePersonInformationQuery(alias);
    const { data: detailsData } = useInformationDetailsQuery(alias);

    const displayPerson = personData || userStore.information.profiles;
    const displayDetails = detailsData || userStore.information.details;

    // Check if viewing own profile
    const isOwnProfile = !alias || alias === userStore.information.profiles.alias;

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
        {
            label: "Steps",
            value: "8,432",
            unit: "steps",
            icon: <Footprints size={28} />,
            color: "bg-green-500",
            textColor: "text-green-600",
            bgLight: "bg-green-50",
            trend: "+12%",
            progress: 84
        },
        {
            label: "Heart Rate",
            value: "72",
            unit: "bpm",
            icon: <Heart size={28} />,
            color: "bg-red-500",
            textColor: "text-red-600",
            bgLight: "bg-red-50",
            trend: "Normal",
            progress: 72 // Used for visualization
        },
        {
            label: "Calories",
            value: "1,850",
            unit: "kcal",
            icon: <Flame size={28} />,
            color: "bg-orange-500",
            textColor: "text-orange-600",
            bgLight: "bg-orange-50",
            trend: "+5%",
            progress: 65
        },
        {
            label: "Sleep",
            value: "7h 12m",
            unit: "duration",
            icon: <Moon size={28} />,
            color: "bg-indigo-500",
            textColor: "text-indigo-600",
            bgLight: "bg-indigo-50",
            trend: "Good",
            progress: 90
        },
    ];

    useEffect(() => {
        // useUserProfileStore.getState().fetchFromDatabase();

        if (state.matches('success')) {
            if (mode === 'admin') {
                imageObjectStore.incrementAvatarVersion();
            }
            if (mode === 'cover') {
                imageObjectStore.incrementCoverVersion();
            }
        }
    }, [state.value]);

    const ADMIN_IMAGE_URL = `/object/duylongwebappobjectdatabase/${displayPerson.alias}/admin.png?v=${imageObjectStore.versions.avatarVersion}`;
    const COVER_PHOTO_URL = `/object/duylongwebappobjectdatabase/${displayPerson.alias}/cover.png?v=${imageObjectStore.versions.coverVersion}`;
    const [profileBlobUrl, setProfileBlobUrl] = useState<string>('');
    const [coverBlobUrl, setCoverBlobUrl] = useState<string>('');

    // Fetch Image via Axios
    useEffect(() => {
        let profileUrl = '';
        let coverUrl = '';

        const loadImage = async (url: string, setter: (val: string) => void) => {
            if (!displayPerson.alias) return;
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
    }, [displayPerson.alias, imageObjectStore.versions.avatarVersion, imageObjectStore.versions.coverVersion]);
    const handleUploadStart = (file: File) => {
        send({ type: 'FILE_SELECTED', file, mode: mode as 'admin' | 'cover' });
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
            if (state.context.mode === 'admin') {
                updateProfileImageUrl(state.context.uploadedUrl);
                console.log("🔄 Updated store with new profile image URL:", state.context.uploadedUrl);
            } else if (state.context.mode === 'cover') {
                updateCoverImageUrl(state.context.uploadedUrl);
                console.log("🔄 Updated store with new cover image URL:", state.context.uploadedUrl);
            }
        }
    }, [state.matches('success'), state.context.uploadedUrl, state.context.mode, updateProfileImageUrl, updateCoverImageUrl]);

    return (
        <div className="bg-white min-h-screen pb-20">
            <GlassCard className="max-w-5xl mx-auto shadow-xl overflow-hidden mb-6 " color='from-white via-white to-white'>
                {/* Cover Image */}
                <div className="relative h-[300px] md:h-[400px] bg-gray-100 overflow-hidden group">
                    <img src={coverBlobUrl} alt="Cover" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                    <div className="absolute inset-0 bg-linear-to-b from-black/30 via-transparent to-black/60"></div>

                    {isOwnProfile && (
                        <button
                            className="absolute bottom-6 z-40 right-6 bg-white/10 backdrop-blur-xl border border-white/20 text-white font-semibold py-2.5 px-5 rounded-2xl flex items-center hover:bg-white/20 transition-all shadow-2xl group/btn"
                            onClick={() => { setMode('cover'); setIsEditModalOpen(true); }}
                        >
                            <CameraIcon className="h-5 w-5 mr-2 group-hover/btn:scale-110 transition-transform" />
                            Edit Cover
                        </button>
                    )}
                </div>

                {/* Profile Header */}
                <div className="relative px-8 pb-8">
                    <div className="flex flex-col md:flex-row items-end -mt-[70px] mb-6">
                        {/* Avatar */}
                        <div className={`relative group ${isOwnProfile ? 'cursor-pointer' : ''}`} onClick={() => { if (isOwnProfile) { setMode('admin'); setIsEditModalOpen(true); } }}>
                            <div className="w-[120px] h-[120px] md:w-[160px] md:h-[160px] rounded-full border-4 border-white shadow-2xl overflow-hidden bg-white ring-4 ring-white/50">
                                <img src={profileBlobUrl} alt="Profile" className="w-full h-full object-cover" />
                                {isOwnProfile && (
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-300">
                                        <CameraIcon className="w-8 h-8 text-white" />
                                    </div>
                                )}
                            </div>
                            <div className="absolute bottom-5 right-5 h-5 w-5 bg-green-500 rounded-full border-4 border-white shadow-md"></div>
                        </div>

                        {/* Info */}
                        <div className="mt-4 md:mt-0 md:ml-8 flex-1 text-center md:text-left pt-2">
                            <Typography variant="h2" className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight mb-2" {...commonProps}>
                                {displayPerson.firstName} {displayPerson.lastName}
                            </Typography>

                            <div className="flex flex-wrap justify-center md:justify-start items-center gap-3 mb-4 text-gray-600">
                                <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100/80 backdrop-blur-sm border border-slate-200 text-sm font-medium">
                                    <UsersIcon className="w-4 h-4 text-indigo-500" />
                                    {displayPerson.friends.toLocaleString()} connections
                                </span>
                                {isOwnProfile && (
                                    <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100/80 backdrop-blur-sm border border-slate-200 text-sm font-medium">
                                        <ShieldCheckIcon className="w-4 h-4 text-emerald-500" />
                                        {userAccountStore.account.role}
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-3 mt-6 md:mt-0 w-full md:w-auto">
                            {isOwnProfile ? (
                                <>
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
                                </>
                            ) : (
                                <button className="flex-1 md:flex-none flex items-center justify-center bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2.5 px-8 rounded-xl transition-all shadow-lg shadow-indigo-200 text-sm">
                                    Follow
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Bio */}
                    {displayDetails.bio && (
                        <div className="bg-linear-to-r from-slate-50 to-white p-5 rounded-2xl border border-slate-100 shadow-xs mb-6 mx-8">
                            <p className="text-gray-700 italic text-center md:text-left text-lg leading-relaxed font-light">
                                "{displayDetails.bio}"
                            </p>
                        </div>
                    )}
                </div>

                {/* Navigation Tabs */}
                <div className="px-8 pb-6 border-t border-slate-50/50">
                    <div className="flex p-1.5 bg-slate-100/50 rounded-xl overflow-x-auto no-scrollbar gap-1 max-w-full">
                        {['Posts', 'About', 'Photos', 'Security', 'Contact'].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab as any)}
                                className={`px-5 py-2.5 font-semibold text-sm rounded-lg transition-all duration-300 min-w-max flex-1 md:flex-none ${activeTab === tab
                                    ? 'bg-white text-indigo-600 shadow-sm ring-1 ring-slate-100'
                                    : 'text-slate-500 hover:text-indigo-600 hover:bg-white/60'
                                    }`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>
                </div>
            </GlassCard>

            {/* Content Layout */}
            <div className="max-w-5xl mx-auto px-4 md:px-0 flex flex-col md:flex-row gap-6">
                {/* Left Column */}
                <div className="w-full md:w-[350px] space-y-6">
                    {/* Intro Card */}
                    <GlassCard className="p-0 overflow-hidden bg-white/60! backdrop-blur-xl border border-white/40 shadow-sm hover:shadow-md transition-all duration-300">
                        <div className="p-6 border-b border-slate-100/50 bg-white/40">
                            <Typography variant="h5" className="font-bold text-gray-800" {...commonProps}>Intro</Typography>
                        </div>
                        <div className="p-6 space-y-5">
                            <div className="flex items-start gap-4 text-gray-600 group">
                                <div className="p-2 rounded-lg bg-indigo-50 text-indigo-500 group-hover:bg-indigo-100 transition-colors">
                                    <AcademicCapIcon className="h-5 w-5" />
                                </div>
                                <div className="flex-1">
                                    {(editAdminInformationState.value !== "onEdit" && editAdminInformationState.value !== "onType")
                                        ? <div className="text-sm">Studied at <span className="font-semibold text-gray-900 block text-base">{displayDetails.university}</span></div>
                                        : <input type="text" className="border-b-2 border-indigo-200 focus:border-indigo-500 rounded-none px-0 py-1 w-full text-sm outline-none bg-transparent transition-colors" value={university} onChange={(e) => setUniversity(e.target.value)} placeholder="University" />}
                                </div>
                            </div>

                            <div className="flex items-start gap-4 text-gray-600 group">
                                <div className="p-2 rounded-lg bg-emerald-50 text-emerald-500 group-hover:bg-emerald-100 transition-colors">
                                    <MapPinIcon className="h-5 w-5" />
                                </div>
                                <div className="flex-1">
                                    {(editAdminInformationState.value !== "onEdit" && editAdminInformationState.value !== "onType")
                                        ? <div className="text-sm">Lives in <span className="font-semibold text-gray-900 block text-base">{displayDetails.country}</span></div>
                                        : <input type="text" className="border-b-2 border-indigo-200 focus:border-indigo-500 rounded-none px-0 py-1 w-full text-sm outline-none bg-transparent transition-colors" value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Location" />}
                                </div>
                            </div>

                            <div className="flex items-start gap-4 text-gray-600 group">
                                <div className="p-2 rounded-lg bg-violet-50 text-violet-500 group-hover:bg-violet-100 transition-colors">
                                    <ComputerDesktopIcon className="h-5 w-5" />
                                </div>
                                <div className="flex-1">
                                    <div className="text-sm text-gray-500">Registry IP</div>
                                    <div className="font-mono text-xs bg-slate-100 px-2 py-1 rounded inline-block mt-1 text-slate-600 border border-slate-200">
                                        {userAccountStore.account.ip}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="p-4 bg-slate-50/50 border-t border-slate-100">
                            <button className="w-full bg-white hover:bg-slate-50 text-indigo-600 font-semibold py-2.5 rounded-xl border border-indigo-100 hover:border-indigo-200 transition-all text-sm shadow-xs hover:shadow-sm">
                                Edit Public Details
                            </button>
                        </div>
                    </GlassCard>

                    {/* Admin Access */}

                </div>

                {/* Right Column (Tabs Content) */}
                <div className="flex-1 space-y-6">
                    {/* Stats Grid */}
                    {/* Stats Grid - Enhanced Industry Standard Design */}
                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                        {stats.map((stat, index) => (
                            <GlassCard key={index} className="p-6 hover:-translate-y-1 transition-all duration-300 border border-slate-100 shadow-sm hover:shadow-lg bg-white/80! backdrop-blur-xl">
                                <div className="flex items-start justify-between mb-4">
                                    <div className={`p-3 rounded-2xl ${stat.bgLight} ${stat.textColor} shadow-xs`}>
                                        {stat.icon}
                                    </div>
                                    <div className={`px-2.5 py-1 rounded-full text-xs font-bold ${stat.color.replace('bg-', 'text-')} bg-white border border-slate-100 shadow-xs`}>
                                        {stat.trend}
                                    </div>
                                </div>

                                <div className="space-y-1">
                                    <Typography className="text-slate-500 text-sm font-semibold uppercase tracking-wider" {...commonProps}>
                                        {stat.label}
                                    </Typography>
                                    <div className="flex items-baseline gap-2">
                                        <Typography variant="h3" className="text-3xl font-bold text-slate-800 tracking-tight" {...commonProps}>
                                            {stat.value}
                                        </Typography>
                                        <span className="text-sm font-medium text-slate-400">{stat.unit}</span>
                                    </div>
                                </div>

                                {/* Progress Indicator */}
                                <div className="mt-5 space-y-2">
                                    <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${stat.progress}%` }}
                                            transition={{ duration: 1, ease: "easeOut" }}
                                            className={`h-full rounded-full ${stat.color}`}
                                        />
                                    </div>
                                    <div className="flex justify-between text-xs font-medium text-slate-400">
                                        <span>Daily Goal</span>
                                        <span>{stat.progress}%</span>
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

                            <GlassCard className="bg-linear-to-br from-indigo-600 to-purple-700 p-8 text-white">
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
            {/* <h1>sss</h1> */}
            {/* Edit Modal */}
            <AnimatePresence>
                {isEditModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4  top-15!  bg-black/60 backdrop-blur-sm">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="bg-white rounded-2xl shadow-2xl w-full max-w-lg  absolute top-10!  overflow-hidden border border-slate-100"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="flex justify-between items-center p-5 border-b border-slate-100">
                                <h2 className="text-xl font-bold text-black">Change {mode === 'cover' ? 'Cover' : 'Profile'} Photo</h2>
                                <button onClick={handleCloseModal} className="p-2 rounded-full hover:bg-slate-100 text-white transition-all">
                                    <XMarkIcon className="w-5 h-5" />
                                </button>
                            </div>

                            <div className="p-6  border-slate-100  shadow-2xl">
                                <input
                                    className="w-full p-2 m-2 border border-slate-300 rounded-xl mb-6 text-black focus:ring-2 focus:ring-indigo-500 outline-none"
                                    placeholder="Enter file name (optional)"
                                    type="text" value={nameFromInput} onChange={(e) => setNameFromInput(e.target.value)}
                                />

                                <MinIOUploadComponent
                                    onUpload={handleUploadStart}
                                    progress={state.context.progress}
                                    isUploading={state.matches('uploading')}
                                    error={state.context.error}
                                    onHandleClose={handleCloseModal}
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
