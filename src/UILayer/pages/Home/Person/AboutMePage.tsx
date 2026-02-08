import React from 'react';
import { Typography, Button, Tooltip, Chip, IconButton } from "@material-tailwind/react";
import { GlassCard } from './GlassContainer';
import { useUserProfileStore, useUserSkillStore } from '../../../../OrchestraLayer/StateManager/Zustand/userProfileStore';
import { userArhiveStore } from '../../../../OrchestraLayer/StateManager/Zustand/userArhives';
import axios from 'axios';
import { motion } from 'framer-motion';
import {
    Download,
    Printer,
    ExternalLink,
    Github,
    Linkedin,
    Mail,
    MapPin,
    Briefcase,
    GraduationCap,
    Award,
    Code2,
    CheckCircle2
} from 'lucide-react';

// --- Icons ---
const ArrowTopRightOnSquareIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
    </svg>
);

// --- Props ---
interface AboutMePageProps {
    stats?: any[];
    achievements?: any[];
}

const AboutMePage: React.FC<AboutMePageProps> = () => {
    const userArchive = userArhiveStore();
    const userStore = useUserProfileStore();
    const skillStore = useUserSkillStore();

    const [isCVExist, setIsCVExist] = React.useState(false);
    const [isLoading, setIsLoading] = React.useState(true);

    const CVPDFLink = userStore.information.profiles.alias === "" || userStore.information.profiles.alias === undefined
        ? "/object/duylongwebappobjectdatabase/b265dab1-cf08-4643-8214-d380fa18063e/cv/cv.pdf"
        : `/object/duylongwebappobjectdatabase/${userStore.information.profiles.alias}/cv/cv.pdf`;

    React.useEffect(() => {
        const checkCV = async () => {
            setIsLoading(true);
            try {
                const response = await axios.get(CVPDFLink);
                setIsCVExist(response.status === 200 || response.status === 304);
            } catch (error) {
                console.error("CV not found or error fetching:", error);
                setIsCVExist(false);
            } finally {
                setIsLoading(false);
            }
        };
        checkCV();
    }, [CVPDFLink]);

    const handleDownload = () => {
        window.open(CVPDFLink, '_blank');
    };

    const handlePrint = () => {
        const printWindow = window.open(CVPDFLink, '_blank');
        if (printWindow) {
            printWindow.onload = () => {
                printWindow.print();
            };
        }
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.2
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { type: "spring" as const, stiffness: 100, damping: 20 }
        }
    };

    const commonProps = {
        placeholder: "",
        onPointerEnterCapture: () => { },
        onPointerLeaveCapture: () => { },
    } as any;

    return (
        <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="min-h-screen p-2 md:p-2 space-y-8 max-w-7xl mx-auto"
        >
            {/* Header / Hero Section */}
            <motion.div variants={itemVariants} className="relative z-10">
                <GlassCard className="p-2 md:p-6 overflow-hidden relative group" >
                    <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                        <GraduationCap size={160} />
                    </div>

                    <div className="flex flex-col md:flex-row gap-8 items-center md:items-start relative z-10">

                        <div className="flex-1 flex flex-row md:flex-row gap-8 items-center md:items-start">
                            <div className="flex-1 text-center  md:text-left space-y-4">
                                <div>
                                    <p variant="h2" color="white" className="font-black tracking-tight text-2xl md:text-4xl" {...commonProps}>
                                        {userStore.information.profiles.firstName} {userStore.information.profiles.lastName}
                                    </p>
                                    <p variant="h5" className="text-indigo-400 font-bold tracking-widest uppercase text-sm md:text-base mt-2" {...commonProps}>
                                        {userStore.information.details.occupation || "Software Engineer / Designer"}
                                    </p>

                                </div>
                              
                            </div>
                              <div className="flex items-center gap-2 text-white/70 bg-white/5 px-4 py-2 rounded-full border border-white/10 max-[410px]:hidden">
                                    <MapPin size={16} className="text-indigo-400" />
                                    <span className="text-sm">{userStore.information.details.location || "Remote"}, {userStore.information.details.country || "Earth"}</span>
                                </div>

                            <div className="flex flex-wrap justify-center md:justify-start gap-3 mt-4">
                                {userStore.information.details.github_url && (
                                    <IconButton size="md" variant="text" color="white" className="bg-white/5 hover:bg-white/10" onClick={() => window.open(userStore.information.details.github_url, '_blank')} {...commonProps}>
                                        <Github size={20} />
                                    </IconButton>
                                )}
                                {userStore.information.details.linkedin_url && (
                                    <IconButton size="md" variant="text" color="white" className="bg-white/5 hover:bg-white/10" onClick={() => window.open(userStore.information.details.linkedin_url, '_blank')} {...commonProps}>
                                        <Linkedin size={20} />
                                    </IconButton>
                                )}
                                {userStore.information.details.website_url && (
                                    <IconButton size="md" variant="text" color="white" className="bg-white/5 hover:bg-white/10" onClick={() => window.open(userStore.information.details.website_url, '_blank')} {...commonProps}>
                                        <ExternalLink size={20} />
                                    </IconButton>
                                )}
                            </div>
                        </div>
                    </div>
                </GlassCard>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                {/* Left Column: Details & Stats (4 cols) */}
                <div className="lg:col-span-4 space-y-6 order-2 lg:order-1">
                    {/* Bio Card */}
                    <motion.div variants={itemVariants}>
                        <GlassCard className="p-8" color="from-slate-800/40 via-slate-900/40 to-slate-800/40">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-2 rounded-lg bg-indigo-500/20 text-indigo-400">
                                    <Briefcase size={20} />
                                </div>
                                <Typography variant="h6" color="white" className="font-bold" {...commonProps}>Executive Bio</Typography>
                            </div>
                            <Typography className="text-white/80 leading-relaxed font-light italic border-l-2 border-indigo-500/50 pl-4" {...commonProps}>
                                "{userStore.information.details.bio || "Crafting digital experiences with passion and precision. Specializing in modern web architectures and performance-driven solutions."}"
                            </Typography>
                        </GlassCard>
                    </motion.div>

                    {/* Stats / Skills Grid */}
                    <motion.div variants={itemVariants}>
                        <GlassCard className="p-8" color="from-slate-800/40 via-slate-900/40 to-slate-800/40">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-2 rounded-lg bg-indigo-500/20 text-indigo-400">
                                    <Code2 size={20} />
                                </div>
                                <Typography variant="h6" color="white" className="font-bold" {...commonProps}>Tech Stack</Typography>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {skillStore.value.map((skill, i) => (
                                    <Chip
                                        key={i}
                                        size="sm"
                                        variant="filled"
                                        value={skill.name}
                                        className="bg-indigo-500/10 text-indigo-200 border border-indigo-500/20 font-medium normal-case py-1.5 px-3 hover:bg-indigo-500/30 transition-colors cursor-default"
                                        {...commonProps}
                                    />
                                ))}
                            </div>
                            <Button
                                variant="text"
                                color="white"
                                className="mt-6 flex items-center gap-2 normal-case w-full justify-center bg-white/5 hover:bg-white/10"
                                onClick={() => window.location.href = '/home/person/skill'}
                                {...commonProps}
                            >
                                View Detailed Skills <ExternalLink size={14} />
                            </Button>
                        </GlassCard>
                    </motion.div>

                    {/* Career Highlights */}
                    {userArchive.archive && userArchive.archive.length > 0 && (
                        <motion.div variants={itemVariants}>
                            <GlassCard className="p-8" color="from-slate-800/40 via-slate-900/40 to-slate-800/40">
                                <div className="flex items-center gap-3 mb-8">
                                    <div className="p-2 rounded-lg bg-indigo-500/20 text-indigo-400">
                                        <Award size={20} />
                                    </div>
                                    <Typography variant="h6" color="white" className="font-bold" {...commonProps}>Achievements</Typography>
                                </div>
                                <div className="space-y-8 relative before:absolute before:inset-y-0 before:left-[11px] before:w-[2px] before:bg-white/10">
                                    {userArchive.archive.slice(0, 4).map((item, i) => (
                                        <div key={i} className="flex gap-6 items-start relative">
                                            <div className="w-6 h-6 rounded-full bg-indigo-500 border-4 border-slate-900 shrink-0 z-10 shadow-lg shadow-indigo-500/20 mt-1"></div>
                                            <div className="space-y-1">
                                                <Typography className="text-xs font-black text-indigo-300 uppercase tracking-widest" {...commonProps}>
                                                    {item.category || "Milestone"}
                                                </Typography>
                                                <Typography className="text-sm text-white/80 leading-relaxed font-medium" {...commonProps}>
                                                    {item.content}
                                                </Typography>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </GlassCard>
                        </motion.div>
                    )}
                </div>

                {/* Right Column: CV Preview (8 cols) */}
                <div className="lg:col-span-8 order-1 lg:order-2">
                    <motion.div variants={itemVariants} className="h-full">
                        <GlassCard className="p-0 overflow-hidden shadow-2xl flex flex-col h-full min-h-[1100px] border-white/20" color="from-slate-900 via-slate-950 to-black">
                            {/* CV Toolbar */}
                            <div className="p-4 md:px-6 md:py-4 border-b border-white/10 flex flex-wrap justify-between items-center bg-white/5 backdrop-blur-2xl">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-indigo-500/20 flex items-center justify-center text-indigo-400 border border-indigo-500/30">
                                        <CheckCircle2 size={24} />
                                    </div>
                                    <div>
                                        <Typography variant="h6" color="white" className="font-black leading-tight" {...commonProps}>
                                            RESUME / CV
                                        </Typography>

                                    </div>
                                </div>

                                <div className="flex items-center gap-2 mt-4 sm:mt-0">
                                    <div className="flex bg-white/5 p-1 rounded-xl border border-white/10 mr-2">
                                        <Tooltip content="Download PDF">
                                            <IconButton size="md" variant="text" color="white" className="hover:bg-indigo-500/20 hover:text-indigo-400" onClick={handleDownload} {...commonProps}>
                                                <Download size={20} />
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip content="Print Document">
                                            <IconButton size="md" variant="text" color="white" className="hover:bg-indigo-500/20 hover:text-indigo-400" onClick={handlePrint} {...commonProps}>
                                                <Printer size={20} />
                                            </IconButton>
                                        </Tooltip>
                                    </div>
                                    <Button
                                        size="md"
                                        color="indigo"
                                        variant="gradient"
                                        className="flex items-center gap-2 normal-case py-2.5 rounded-xl font-bold shadow-indigo-500/20"
                                        onClick={() => window.open(CVPDFLink, '_blank')}
                                        {...commonProps}
                                    >
                                        View Full <ArrowTopRightOnSquareIcon />
                                    </Button>
                                </div>
                            </div>

                            {/* PDF Viewport with decorative frame */}
                            <div className="flex-1 bg-slate-950 relative group/preview p-1 md:p-3 overflow-y-auto">
                                <div className="absolute inset-0 bg-indigo-500/5 pointer-events-none"></div>

                                {isLoading ? (
                                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-950/80 backdrop-blur-sm z-20">
                                        <div className="w-16 h-16 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin mb-4" />
                                        <Typography className="text-white/40 font-bold uppercase tracking-widest text-xs" {...commonProps}>Loading Document...</Typography>
                                    </div>
                                ) : isCVExist ? (
                                    <div className="w-full h-full min-h-[1000px] relative rounded-lg border border-white/5 shadow-inner ">
                                        <iframe
                                            src={`${CVPDFLink}#toolbar=0&navpanes=0&scrollbar=1&view=FitW`}
                                            className="absolute inset-0 w-full h-full border-none opacity-90 transition-all duration-500 grayscale-[0.2] group-hover/preview:grayscale-0 group-hover/preview:opacity-100"
                                            title="CV Preview"
                                        />



                                        <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_100px_rgba(0,0,0,0.4)]"></div>
                                    </div>
                                ) : (
                                    <div className="absolute inset-0 flex flex-col items-center justify-center text-white gap-6 p-12 text-center bg-slate-950">
                                        <div className="w-24 h-24 rounded-3xl bg-white/5 flex items-center justify-center text-white/10 mb-2 border border-white/10 group-hover:bg-indigo-500/10 group-hover:text-indigo-400 group-hover:border-indigo-500/30 transition-all duration-500">
                                            <ExternalLink size={48} />
                                        </div>
                                        <div className="space-y-2">
                                            <Typography variant="h4" color="white" className="font-black" {...commonProps}>Document Unavailable</Typography>
                                            <Typography className="text-white/40 max-w-sm font-medium leading-relaxed" {...commonProps}>
                                                The professional CV document could not be securely retrieved from the vault.
                                            </Typography>
                                        </div>
                                        <Button
                                            variant="outlined"
                                            color="white"
                                            className="border-white/10 hover:border-indigo-500 text-white/60 hover:text-white transition-all rounded-xl"
                                            onClick={() => window.location.reload()}
                                            {...commonProps}
                                        >
                                            Secure Re-sync
                                        </Button>
                                    </div>
                                )}
                            </div>
                        </GlassCard>
                    </motion.div>
                </div>
            </div>
        </motion.div>
    );
};

export default AboutMePage;