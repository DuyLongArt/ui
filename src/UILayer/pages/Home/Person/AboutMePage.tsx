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

    console.log("userStore.information.profiles.alias", userStore.information.profiles.alias);
    const CVPDFLink = userStore.information.profiles.alias === "" || userStore.information.profiles.alias === undefined ? "https://backend.duylong.art/object/duylongwebappobjectdatabase/b265dab1-cf08-4643-8214-d380fa18063e/cv/cv.pdf" : `https://backend.duylong.art/object/duylongwebappobjectdatabase/${userStore.information.profiles.alias}/cv/cv.pdf`;

    React.useEffect(() => {
        const checkCV = async () => {
            setIsLoading(true);
            const response = await axios.get(CVPDFLink);
            console.log("===================================")
            console.log(response);
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
    }, []);

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
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.6,
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, x: -20 },
        visible: { opacity: 1, x: 0 }
    };

    // Shared common props for Material Tailwind components to avoid boilerplate error
    const commonProps = {
        placeholder: "",
        onPointerEnterCapture: () => { },
        onPointerLeaveCapture: () => { },
        onResize: () => { },
        onResizeCapture: () => { },
    } as any;

    return (
        <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="p-4 md:p-8 space-y-8 max-w-7xl mx-auto"
        >


            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Left Column: CV Preview */}
                <div className="md:col-span-2 space-y-6">
                    <GlassCard className="p-0 overflow-hidden shadow-bold flex flex-col h-full group/cv" color='from-slate-800 via-slate-900 to-black'>
                        {/* CV Toolbar */}
                        <div className="p-4 md:px-6 md:py-4 border-b border-white/10 flex flex-wrap justify-between items-center bg-white/5 backdrop-blur-xl">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-lg bg-indigo-500/20 flex items-center justify-center text-indigo-400">
                                    <CheckCircle2 size={24} />
                                </div>
                                <div>
                                    <Typography variant="h6" color="white" className="font-bold leading-tight" {...commonProps}>
                                        Curriculum Vitae
                                    </Typography>
                                    <Typography variant="small" className="text-white/40 text-[10px] uppercase tracking-widest font-bold" {...commonProps}>
                                        Professional Document
                                    </Typography>
                                </div>
                            </div>

                            <div className="flex items-center gap-2 mt-2 sm:mt-0">
                                <Tooltip content="Download PDF">
                                    <IconButton size="sm" variant="text" className="text-white bg-white/5 hover:bg-white/10 p-2" onClick={handleDownload} {...commonProps}>
                                        <Download size={18} />
                                    </IconButton>
                                </Tooltip>
                                <Tooltip content="Print CV">
                                    <IconButton size="sm" variant="text" className="text-white bg-white/5 hover:bg-white/10 p-2" onClick={handlePrint} {...commonProps}>
                                        <Printer size={18} />
                                    </IconButton>
                                </Tooltip>
                                <Button
                                    size="sm"
                                    color="indigo"
                                    variant="gradient"
                                    className="flex items-center gap-2 normal-case py-2"
                                    onClick={() => window.open(CVPDFLink, '_blank')}
                                    {...commonProps}
                                >
                                    View Full Screen <ArrowTopRightOnSquareIcon />
                                </Button>
                            </div>
                        </div>

                        {/* PDF Embed Area */}
                        <div className="w-full h-[70vh] min-h-[500px] bg-slate-900/50 relative overflow-hidden group">
                            {isLoading ? (
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
                                </div>
                            ) : isCVExist ? (
                                <iframe
                                    src={`${CVPDFLink}#toolbar=0&navpanes=0&scrollbar=0`}
                                    className="w-full h-full border-none opacity-90 group-hover:opacity-100 transition-opacity"
                                    title="CV Preview"
                                />
                            ) : (
                                <div className="absolute inset-0 flex flex-col items-center justify-center text-white gap-4 p-8 text-center">
                                    <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center text-white/20 mb-2">
                                        <ExternalLink size={40} />
                                    </div>
                                    <Typography variant="h5" color="white" {...commonProps}>CV Document Not Found</Typography>
                                    <Typography className="text-white/60 max-w-md" {...commonProps}>
                                        We couldn't locate your CV at the expected location. Please ensure the file is uploaded correctly.
                                    </Typography>
                                    <Button variant="outlined" color="white" className="border-white/20" onClick={() => window.location.reload()} {...commonProps}>
                                        Try Refreshing
                                    </Button>
                                </div>
                            )}

                            {/* Hover Overlay for direct link */}
                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none md:hidden">
                                <Typography className="text-white text-sm bg-black/60 px-4 py-2 rounded-full border border-white/20" {...commonProps}>
                                    Viewing Preview
                                </Typography>
                            </div>
                        </div>
                    </GlassCard>
                </div>

                {/* Right Column: Dynamic Bio & Skills */}
                <div className="space-y-6">
                    {/* About Me Section */}
                    <motion.div variants={itemVariants}>
                        <GlassCard className="p-8 relative overflow-hidden">
                            <div className="absolute -top-4 -right-4 text-white/5 rotate-12">
                                <Briefcase size={80} />
                            </div>
                            <Typography
                                variant="small"
                                className="text-black uppercase tracking-[0.2em] mb-4 font-black text-xs"
                                {...commonProps}
                            >
                                Executive Summary
                            </Typography>
                            <Typography
                                className="text-white leading-relaxed text-lg font-light italic border-l-2 border-indigo-500/50 pl-6 py-2"
                                {...commonProps}
                            >
                                "{userStore.information.details.bio || "Crafting digital experiences with passion and precision. Specializing in modern web architectures and performance-driven solutions."}"
                            </Typography>
                        </GlassCard>
                    </motion.div>

                    {/* Skills Summary Section */}
                    {skillStore.value && skillStore.value.length > 0 && (
                        <motion.div variants={itemVariants}>
                            <GlassCard className="p-8">
                                <Typography
                                    variant="small"
                                    className="text-black uppercase tracking-[0.2em] mb-6 font-black text-xs"
                                    {...commonProps}
                                >
                                    Technical Expertise
                                </Typography>
                                <div className="flex flex-wrap gap-2">
                                    {skillStore.value.map((skill, i) => (
                                        <motion.div
                                            key={i}
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                        >
                                            <Chip
                                                size="sm"
                                                variant="filled"
                                                value={skill.name}
                                                className="bg-indigo-500/20 text-indigo-100 border border-indigo-500/30 font-medium normal-case py-1.5 px-3"
                                                {...commonProps}
                                            />
                                        </motion.div>
                                    ))}
                                </div>
                                <div className="mt-8 pt-6 border-t border-white/10 flex items-center justify-between group cursor-pointer" onClick={() => window.location.href = '/home/person/skill'}>
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 rounded-lg bg-white/5 text-indigo-400 group-hover:bg-indigo-500 group-hover:text-white transition-all">
                                            <Code2 size={18} />
                                        </div>
                                        <span className="text-sm font-bold text-white/80 group-hover:text-white">View detailed skills</span>
                                    </div>
                                    <ExternalLink size={14} className="text-white/40 group-hover:text-white transition-all" />
                                </div>
                            </GlassCard>
                        </motion.div>
                    )}

                    {/* Career Highlights Section */}
                    {userArchive.archive && userArchive.archive.length > 0 && (
                        <motion.div variants={itemVariants}>
                            <GlassCard className="p-8">
                                <Typography
                                    variant="small"
                                    className="text-black uppercase tracking-[0.2em] mb-6 font-black text-xs"
                                    {...commonProps}
                                >
                                    Career Highlights
                                </Typography>
                                <div className="space-y-8 relative before:absolute before:inset-y-0 before:left-[11px] before:w-[2px] before:bg-white/10">
                                    {userArchive.archive.map((item, i) => (
                                        <div key={i} className="flex gap-6 items-start relative list-none">
                                            <div className="w-6 h-6 rounded-full bg-indigo-500 border-4 border-slate-900 shrink-0 z-10 shadow-lg shadow-indigo-500/20 mt-1"></div>
                                            <div>
                                                <Typography
                                                    className="text-xs font-black text-indigo-300 uppercase tracking-wider mb-1"
                                                    {...commonProps}
                                                >
                                                    {item.category || "Achievement"}
                                                </Typography>
                                                <Typography
                                                    className="text-sm text-white/90 leading-relaxed font-medium"
                                                    {...commonProps}
                                                >
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
            </div>
        </motion.div>
    );
};

export default AboutMePage;