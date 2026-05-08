import React from 'react';
import { Container, Typography } from '@mui/material';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import LiquidGlassCard from '../../components/LiquidGlassCard';
import { ArrowLeft, Shield, Lock, FileText, Copyright, Zap } from 'lucide-react';

const PolicyPage: React.FC = () => {
    const navigate = useNavigate();

    const sections = [
        {
            title: "Data Sovereignty & Hubs",
            icon: <Lock className="text-indigo-400" size={24} />,
            content: "ICE Gate acts as a neutral orchestrator. Your data—spanning Health, Social, Finance, and Career hubs—remains under your absolute control. We only bridge connections when you explicitly enroll in a life hub."
        },
        {
            title: "Zero-Trust Vaulting",
            icon: <Shield className="text-cyan-400" size={24} />,
            content: "Digital artifacts are encrypted at rest within our private infrastructure. Following 'Zero-Trust' protocols, your vault remains isolated and dormant until actively summoned through your authenticated identity matrix."
        },
        {
            title: "The XP Governance",
            icon: <Zap className="text-amber-400" size={24} />,
            content: "The Life Orchestration Engine (LOE) gamifies real-world metrics into Quest Points (XP). These algorithms are transparent, ensuring your progress is reflected objectively across all four pillars of self-evolution."
        },
        {
            title: "Identity Permanence",
            icon: <FileText className="text-purple-400" size={24} />,
            content: "Your UUID v7 identity ensures collision-free synchronization. Should you choose to terminate your link, we allow immediate purging of all central gate records, reverting your digital projection to its source."
        },
        {
            title: "Misuse Isolation",
            icon: <Copyright className="text-white/40" size={24} />,
            content: "Any attempt to stress-test or spoof identity within the collective matrix triggers immediate security isolation. Responsibility for the integrity of synchronized data rests solely with the identity owner."
        }
    ];

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, x: -20 },
        visible: { opacity: 1, x: 0 }
    };

    return (
        <div className="min-h-screen w-full flex items-center justify-center p-6 bg-transparent font-['Outfit']">
            <Container maxWidth="md">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <button
                        onClick={() => navigate(-1)}
                        className="mb-8 flex items-center gap-2 text-white/50 hover:text-white transition-colors group"
                    >
                        <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                        Back to Origin
                    </button>

                    <LiquidGlassCard className="p-8 md:p-12 border-white/20">
                        <div className="flex flex-col md:flex-row gap-4 items-center mb-12 border-b border-white/10 pb-8">
                            <div className="p-4 bg-indigo-500/10 rounded-2xl border border-indigo-500/20">
                                <Shield className="text-indigo-400" size={40} />
                            </div>
                            <div className="text-center md:text-left">
                                <h1 className="text-4xl font-black text-white font-['Syne'] tracking-tight">
                                    Governance Protocols
                                </h1>
                                <p className="text-white/40 font-medium uppercase tracking-[0.2em] text-xs mt-1">
                                    Legal Framework / ice-gate-v1.0
                                </p>
                            </div>
                        </div>

                        <motion.div
                            variants={containerVariants}
                            initial="hidden"
                            animate="visible"
                            className="grid grid-cols-1 md:grid-cols-2 gap-8"
                        >
                            {sections.map((section, index) => (
                                <motion.div
                                    key={index}
                                    variants={itemVariants}
                                    className="space-y-4"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-white/5 rounded-lg border border-white/10">
                                            {section.icon}
                                        </div>
                                        <h3 className="text-lg font-bold text-white tracking-tight">
                                            {section.title}
                                        </h3>
                                    </div>
                                    <p className="text-white/60 text-sm leading-relaxed font-medium">
                                        {section.content}
                                    </p>
                                </motion.div>
                            ))}
                        </motion.div>

                        <div className="mt-12 pt-8 border-t border-white/10 text-center">
                            <p className="text-white/20 text-xs font-bold tracking-widest uppercase">
                                Established MMXVI - Refraction Update MMXXVI
                            </p>
                        </div>
                    </LiquidGlassCard>
                </motion.div>
            </Container>
        </div>
    );
};

export default PolicyPage;
