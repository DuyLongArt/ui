import React, { useState } from 'react';
import { Container } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import LiquidGlassCard from '../../components/LiquidGlassCard';
import { ArrowLeft, Send, CheckCircle2, AlertCircle, Sparkles } from 'lucide-react';
import { useSubmitFeedbackMutation } from '../../../DataLayer/APILayer/userQueries';

const FeedbackPage: React.FC = () => {
    const navigate = useNavigate();
    const mutation = useSubmitFeedbackMutation();
    const [submitted, setSubmitted] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        type: 'feedback',
        message: ''
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        mutation.mutate(formData, {
            onSuccess: () => {
                setSubmitted(true);
            },
            onError: (error) => {
                console.error('Feedback submission failed:', error);
                // In a real app, we might show a toast error here
            }
        });
    };

    const containerVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { type: "spring" as any, stiffness: 100, damping: 20 }
        }
    };

    if (submitted) {
        return (
            <div className="min-h-screen w-full flex items-center justify-center p-6 bg-transparent relative overflow-hidden font-['Outfit']">
                <Container maxWidth="sm">
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="text-center"
                    >
                        <LiquidGlassCard className="p-12 border-indigo-500/30 backdrop-blur-3xl">
                            <div className="flex justify-center mb-8">
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ type: "spring", damping: 12 }}
                                    className="p-6 bg-indigo-500/10 rounded-full relative"
                                >
                                    <div className="absolute inset-0 bg-indigo-500/30 blur-3xl rounded-full" />
                                    <CheckCircle2 className="text-indigo-400 relative z-10" size={64} />
                                </motion.div>
                            </div>
                            <h2 className="text-3xl font-black text-white mb-4 font-['Syne']">Resonance Synchronized</h2>
                            <p className="text-white/60 text-lg mb-8 max-w-xs mx-auto">
                                Your frequencies have been integrated into the collective matrix. We value your input.
                            </p>
                            <button
                                onClick={() => navigate('/support/index')}
                                className="w-full py-4 bg-white text-indigo-950 rounded-2xl font-bold text-lg shadow-[0_0_30px_rgba(255,255,255,0.1)] hover:scale-[1.02] active:scale-[0.98] transition-all"
                            >
                                Back to Support Center
                            </button>
                        </LiquidGlassCard>
                    </motion.div>
                </Container>
            </div>
        );
    }

    return (
        <div className="min-h-screen w-full flex items-center justify-center p-6 bg-transparent relative overflow-hidden font-['Outfit']">
            <Container maxWidth="sm" className="relative z-10">
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                >
                    <LiquidGlassCard className="p-10 md:p-14 border-white/10">
                        {/* Header */}
                        <div className="flex items-center gap-4 mb-10">
                            <button
                                onClick={() => navigate('/support')}
                                className="p-2 bg-white/5 hover:bg-white/10 rounded-xl border border-white/5 transition-all"
                            >
                                <ArrowLeft className="text-white/60" size={20} />
                            </button>
                            <h2 className="text-3xl font-black text-white font-['Syne']">Share Feedback</h2>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-white/40 text-sm font-bold uppercase tracking-wider ml-1">Identity (Optional)</label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    placeholder="Your alias"
                                    className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder:text-white/20 focus:outline-none focus:border-indigo-500/50 transition-all font-medium"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-white/40 text-sm font-bold uppercase tracking-wider ml-1">Type of Resonance</label>
                                <div className="grid grid-cols-3 gap-3">
                                    {['feedback', 'bug', 'feature'].map((t) => (
                                        <button
                                            key={t}
                                            type="button"
                                            onClick={() => setFormData({ ...formData, type: t })}
                                            className={`py-3 rounded-xl border capitalize font-bold text-sm transition-all active:scale-95 ${
                                                formData.type === t 
                                                ? 'bg-indigo-500/20 border-indigo-500/50 text-indigo-300' 
                                                : 'bg-white/5 border-white/5 text-white/40 hover:bg-white/10'
                                            }`}
                                        >
                                            {t}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-white/40 text-sm font-bold uppercase tracking-wider ml-1">Message</label>
                                <textarea
                                    required
                                    rows={5}
                                    value={formData.message}
                                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                    placeholder="Describe your thoughts..."
                                    className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder:text-white/20 focus:outline-none focus:border-indigo-500/50 transition-all font-medium resize-none"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={mutation.isPending}
                                className={`w-full group relative flex items-center justify-center gap-3 py-4 px-8 bg-white text-indigo-950 rounded-2xl font-bold text-xl transition-all hover:scale-[1.02] active:scale-[0.98] shadow-2xl overflow-hidden ${mutation.isPending ? 'opacity-50 cursor-not-allowed' : ''}`}
                            >
                                <div className="absolute inset-0 bg-linear-to-r from-indigo-50 to-white opacity-0 group-hover:opacity-100 transition-opacity" />
                                {mutation.isPending ? (
                                    <motion.div
                                        animate={{ rotate: 360 }}
                                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                    >
                                        <Sparkles size={22} className="relative z-10" />
                                    </motion.div>
                                ) : (
                                    <>
                                        <Send size={20} className="relative z-10" />
                                        <span className="relative z-10">Transmit</span>
                                    </>
                                )}
                            </button>
                        </form>

                        <div className="mt-8 flex items-center gap-3 p-4 bg-indigo-500/5 rounded-2xl border border-indigo-500/10">
                            <AlertCircle className="text-indigo-400 shrink-0" size={20} />
                            <p className="text-xs text-indigo-200/50 font-medium leading-relaxed">
                                Your feedback helps us recalibrate the ICE GATE for better synchronization.
                            </p>
                        </div>
                    </LiquidGlassCard>
                </motion.div>
            </Container>
        </div>
    );
};

export default FeedbackPage;
