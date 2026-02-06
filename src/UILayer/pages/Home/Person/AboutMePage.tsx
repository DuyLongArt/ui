import React from 'react';
import { Typography, Button } from "@material-tailwind/react";
import { GlassCard } from './GlassContainer';
import { useUserAccountStore, useUserProfileStore } from '../../../../OrchestraLayer/StateManager/Zustand/userProfileStore';
import { userArhiveStore } from '../../../../OrchestraLayer/StateManager/Zustand/userArhives';
import axios from 'axios';

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


    const [isCVExist, setIsCVExist] = React.useState(false);
    const CVPDFLink = `http://192.168.22.4:9000/duylongwebappobjectdatabase/${userStore.information.profiles.alias}/cv/cv.pdf`;

    React.useEffect(() => {
        const checkCV = async () => {
            try {
                const response = await axios.get(CVPDFLink);
                setIsCVExist(response.status === 200);
            } catch (error) {
                console.error("CV not found or error fetching:", error);
                setIsCVExist(false);
            }
        };
        checkCV();
    }, [CVPDFLink]);


    return (
        <div className="p-2 md:p-4 grid grid-cols-1 md:grid-cols-3 gap-8 animate-fade-in-up">

            {/* Left Column: CV (Main Content) */}
            <div className="md:col-span-2 space-y-8">

                <GlassCard className="p-0 overflow-hidden shadow-bold flex flex-col h-full " color='from-indigo-400 via-indigo-400 to-indigo-400'>
                    {/* Header with Title and Open Button */}
                    <div className="p-4 md:p-6 border-b border-white/20 flex justify-between items-center bg-white/10 backdrop-blur-md">
                        <Typography
                            variant="h5"
                            color="white"
                            className="font-bold tracking-tight"
                            placeholder=""
                            onPointerEnterCapture={() => { }}
                            onPointerLeaveCapture={() => { }}
                            onResize={() => { }}
                            onResizeCapture={() => { }}
                        >
                            Curriculum Vitae
                        </Typography>

                        <a href={CVPDFLink} target="_blank" rel="noopener noreferrer">
                            <Button
                                size="sm"
                                variant="text"
                                className="flex items-center text-white gap-2 hover:bg-white/20 normal-case"
                                placeholder=""
                                onPointerEnterCapture={() => { }}
                                onPointerLeaveCapture={() => { }}
                                onResize={() => { }}
                                onResizeCapture={() => { }}
                            >
                                Open in new tab <ArrowTopRightOnSquareIcon />
                            </Button>
                        </a>
                    </div>

                    {/* PDF Embed Area */}

                    {isCVExist && (
                        <div className="w-full h-[80vh] min-h-[600px] bg-slate-50 relative">
                            <iframe
                                src={`${CVPDFLink}#toolbar=0&navpanes=0&scrollbar=0`}
                                className="w-full h-full border-none"
                                title="CV Preview"
                            />

                            {/* Fallback for browsers that don't support iframes/pdf embedding */}
                            <div className="absolute inset-0 flex flex-col items-center justify-center -z-10 text-white gap-2">
                                <Typography
                                    placeholder=""
                                    onPointerEnterCapture={() => { }}
                                    onPointerLeaveCapture={() => { }}
                                    onResize={() => { }}
                                    onResizeCapture={() => { }}
                                >
                                    Loading PDF...
                                </Typography>
                                <a href={CVPDFLink} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline text-sm">
                                    Click here if it doesn't load
                                </a>
                            </div>
                        </div>
                    )}
                </GlassCard>
            </div>

            {/* Right Column: Bio / About Me */}
            <div className="space-y-6">
                <GlassCard className="p-6 md:p-8">
                    <Typography
                        variant="small"
                        className="text-white uppercase tracking-widest mb-4 font-bold text-2xl"
                        placeholder=""
                        onPointerEnterCapture={() => { }}
                        onPointerLeaveCapture={() => { }}
                        onResize={() => { }}
                        onResizeCapture={() => { }}
                    >
                        About Me
                    </Typography>
                    <Typography
                        className="text-white  italic leading-relaxed text-2xl font-light"
                        placeholder=""
                        onPointerEnterCapture={() => { }}
                        onPointerLeaveCapture={() => { }}
                        onResize={() => { }}
                        onResizeCapture={() => { }}
                    >
                        "{userStore.information.details.bio || "No bio available."}"
                    </Typography>
                </GlassCard>

                {/* Highlights Section */}
                {userArchive.archive && userArchive.archive.length > 0 && (
                    <GlassCard className="p-6 md:p-8">
                        <Typography
                            variant="small"
                            className="text-white uppercase tracking-widest mb-4 font-bold text-xs"
                            placeholder=""
                            onPointerEnterCapture={() => { }}
                            onPointerLeaveCapture={() => { }}
                            onResize={() => { }}
                            onResizeCapture={() => { }}
                        >
                            Highlights
                        </Typography>
                        <div className="space-y-6">
                            {userArchive.archive.map((item, i) => (
                                <div key={i} className="flex gap-4 items-start group">
                                    <div className="w-2 h-2 mt-2 rounded-full bg-blue-500 shrink-0 group-hover:scale-125 transition-transform duration-300"></div>
                                    <div>
                                        <Typography
                                            className="text-sm font-bold text-white"
                                            placeholder=""
                                            onPointerEnterCapture={() => { }}
                                            onPointerLeaveCapture={() => { }}
                                            onResize={() => { }}
                                            onResizeCapture={() => { }}
                                        >
                                            {item.category}
                                        </Typography>
                                        <Typography
                                            className="text-sm text-white mt-1"
                                            placeholder=""
                                            onPointerEnterCapture={() => { }}
                                            onPointerLeaveCapture={() => { }}
                                            onResize={() => { }}
                                            onResizeCapture={() => { }}
                                        >
                                            {item.content}
                                        </Typography>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </GlassCard>
                )}
            </div>
        </div>
    );
};

export default AboutMePage;