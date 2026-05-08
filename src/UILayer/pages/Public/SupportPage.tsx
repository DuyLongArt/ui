import React from 'react';
import { Container } from '@mui/material';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import LiquidGlassCard from '../../components/LiquidGlassCard';
import { MessageSquare, HelpCircle, BookOpen, ArrowLeft, Send, Sparkles } from 'lucide-react';

const SupportPage: React.FC = () => {
    const navigate = useNavigate();

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1, delayChildren: 0.2 }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { type: "spring" as any, stiffness: 100, damping: 20 }
        }
    };

    return (
        <div className="min-h-screen w-full flex items-center justify-center p-6 bg-transparent relative overflow-hidden font-['Outfit']">
            {/* Background Background */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-indigo-500/5 blur-[120px] rounded-full" />
            </div>

            <Container maxWidth="md" className="relative z-10">
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="space-y-8"
                >
                    {/* Header */}
                    <motion.div variants={itemVariants} className="text-center mb-12">
                        <button
                            onClick={() => navigate('/entry/index')}
                            className="absolute left-0 top-0 p-3 bg-white/5 hover:bg-white/10 rounded-2xl border border-white/10 transition-all active:scale-95"
                        >
                            <ArrowLeft className="text-white/60" size={24} />
                        </button>
                        <h1 className="text-5xl md:text-6xl font-black text-white tracking-tighter font-['Syne'] mb-4">
                            ICE <span className="text-transparent bg-clip-text bg-linear-to-r from-indigo-400 to-cyan-400">SUPPORT</span>
                        </h1>
                        <p className="text-white/60 text-lg font-medium max-w-md mx-auto">
                            How can we help you navigate the realm of digital artifacts today?
                        </p>
                    </motion.div>

                    {/* Support Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <motion.div variants={itemVariants}>
                            <LiquidGlassCard
                                className="p-8 h-full flex flex-col items-center text-center group cursor-pointer hover:border-indigo-500/30 transition-all"
                                blobColor="bg-indigo-400/20"
                                onClick={() => navigate('/support/feedback')}
                            >
                                <div className="p-4 bg-indigo-500/10 rounded-2xl mb-6 group-hover:scale-110 group-hover:bg-indigo-500/20 transition-all">
                                    <MessageSquare className="text-indigo-400" size={32} />
                                </div>
                                <h3 className="text-xl font-bold text-white mb-2">Send Feedback</h3>
                                <p className="text-white/40 text-sm">Help us evolve by sharing your thoughts and experiences.</p>
                            </LiquidGlassCard>
                        </motion.div>

                        <motion.div variants={itemVariants}>
                            <LiquidGlassCard
                                className="p-8 h-full flex flex-col items-center text-center group cursor-pointer hover:border-cyan-500/30 transition-all"
                                blobColor="bg-cyan-400/20"
                                onClick={() => navigate('/support/help')}
                            >
                                <div className="p-4 bg-cyan-500/10 rounded-2xl mb-6 group-hover:scale-110 group-hover:bg-cyan-500/20 transition-all">
                                    <HelpCircle className="text-cyan-400" size={32} />
                                </div>
                                <h3 className="text-xl font-bold text-white mb-2">Help Center</h3>
                                <p className="text-white/40 text-sm">Browse our knowledge base for answers to common questions.</p>
                            </LiquidGlassCard>
                        </motion.div>

                        <motion.div variants={itemVariants}>
                            <LiquidGlassCard
                                className="p-8 h-full flex flex-col items-center text-center group cursor-pointer hover:border-purple-500/30 transition-all"
                                blobColor="bg-purple-400/20"
                                onClick={() => navigate('/policy/index')}
                            >
                                <div className="p-4 bg-purple-500/10 rounded-2xl mb-6 group-hover:scale-110 group-hover:bg-purple-500/20 transition-all">
                                    <BookOpen className="text-purple-400" size={32} />
                                </div>
                                <h3 className="text-xl font-bold text-white mb-2">Governance</h3>
                                <p className="text-white/40 text-sm">Review our policies and how we protect the collective.</p>
                            </LiquidGlassCard>
                        </motion.div>
                    </div>

                    {/* Common Hubs Section - NEW */}
                    <div className="mt-8">
                        <p className="text-white/30 text-xs font-bold uppercase tracking-[0.2em] mb-6 text-center">
                            Synchronized Hubs
                        </p>
                        <div className="flex justify-center gap-8 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
                            {['Health', 'Social', 'Finance', 'Career'].map((hub) => (
                                <div key={hub} className="flex flex-col items-center gap-2">
                                    <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                                        <Sparkles size={16} className="text-white/40" />
                                    </div>
                                    <span className="text-[10px] font-bold text-white/40 uppercase tracking-tighter">{hub}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Bottom Status Section */}
                    <motion.div variants={itemVariants} className="mt-12">
                        <LiquidGlassCard className="p-8 border-white/5 bg-white/2">
                            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                                <div className="flex items-center gap-4">
                                    <div className="relative">
                                        <div className="absolute inset-0 bg-green-500/20 blur-lg rounded-full" />
                                        <div className="w-3 h-3 bg-green-500 rounded-full relative z-10 animate-pulse" />
                                    </div>
                                    <div className="text-left">
                                        <h4 className="text-white font-bold">Matrix Integrity</h4>
                                        <p className="text-white/40 text-sm">All gates are fully operational</p>
                                    </div>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => navigate('/health/index')}
                                    className="px-6 py-3 bg-white/5 hover:bg-white/10 text-white rounded-xl font-bold text-sm border border-white/10 transition-all active:scale-95"
                                >
                                    Deep Diagnostics
                                </button>
                            </div>
                        </LiquidGlassCard>
                    </motion.div>
                </motion.div>
            </Container>
        </div>
    );
};

export default SupportPage;
