import React, { useState } from 'react';
import { Container } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import LiquidGlassCard from '../../components/LiquidGlassCard';
import { ArrowLeft, ChevronDown, ExternalLink } from 'lucide-react';

const FAQS: { q: string; a: string }[] = [
    {
        q: 'What is ICE GATE?',
        a: 'ICE GATE is your personal hub for login, IoT, storage, and utilities—one place to manage devices and digital artifacts.',
    },
    {
        q: 'I forgot my password or cannot log in',
        a: 'Use the login flow at Ascend. If registration is open, you can create a new account from Join the Collective.',
    },
    {
        q: 'Where do I manage IoT or storage?',
        a: 'After you sign in, open the home navigation for IOT and Utilities (storage, apps, tailscale where enabled).',
    },
    {
        q: 'How do I report a bug or request a feature?',
        a: 'Go to Support → Send Feedback, choose bug or feature, and submit your message.',
    },
];

const HelpCenterPage: React.FC = () => {
    const navigate = useNavigate();
    const [open, setOpen] = useState<number | null>(0);

    return (
        <div className="min-h-screen w-full flex items-center justify-center p-6 bg-transparent relative overflow-hidden font-['Outfit']">
            <Container maxWidth="md" className="relative z-10">
                <div className="mb-8 flex items-center gap-4">
                    <button
                        type="button"
                        onClick={() => navigate('/support/index')}
                        className="p-3 bg-white/5 hover:bg-white/10 rounded-2xl border border-white/10 transition-all"
                        aria-label="Back to support"
                    >
                        <ArrowLeft className="text-white/60" size={22} />
                    </button>
                    <div>
                        <h1 className="text-3xl md:text-4xl font-black text-white font-['Syne'] tracking-tight">
                            Help Center
                        </h1>
                        <p className="text-white/50 text-sm mt-1">Quick answers and links</p>
                    </div>
                </div>

                <LiquidGlassCard className="p-6 md:p-8 border-white/10 mb-8">
                    <p className="text-white/40 text-xs font-bold uppercase tracking-wider mb-4">Common questions</p>
                    <div className="space-y-2">
                        {FAQS.map((item, i) => (
                            <div key={item.q} className="rounded-xl border border-white/10 overflow-hidden bg-white/[0.03]">
                                <button
                                    type="button"
                                    onClick={() => setOpen(open === i ? null : i)}
                                    className="w-full flex items-center justify-between gap-4 px-4 py-3 text-left text-white font-semibold hover:bg-white/5 transition-colors"
                                >
                                    <span>{item.q}</span>
                                    <ChevronDown
                                        size={20}
                                        className={`text-white/40 shrink-0 transition-transform ${open === i ? 'rotate-180' : ''}`}
                                    />
                                </button>
                                <AnimatePresence initial={false}>
                                    {open === i && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: 'auto', opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.2 }}
                                            className="overflow-hidden"
                                        >
                                            <p className="px-4 pb-4 text-white/60 text-sm leading-relaxed border-t border-white/5 pt-3">
                                                {item.a}
                                            </p>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        ))}
                    </div>
                </LiquidGlassCard>

                <LiquidGlassCard className="p-6 md:p-8 border-white/10">
                    <p className="text-white/40 text-xs font-bold uppercase tracking-wider mb-4">Shortcuts</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {[
                            { label: 'Send feedback', path: '/support/feedback' },
                            { label: 'Policies', path: '/policy/index' },
                            { label: 'Health', path: '/health/index' },
                            { label: 'Welcome', path: '/entry/index' },
                        ].map((link) => (
                            <button
                                key={link.path}
                                type="button"
                                onClick={() => navigate(link.path)}
                                className="flex items-center justify-between gap-2 px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white/90 text-sm font-medium hover:bg-white/10 hover:border-white/20 transition-all text-left"
                            >
                                {link.label}
                                <ExternalLink size={16} className="text-white/40 shrink-0" />
                            </button>
                        ))}
                    </div>
                </LiquidGlassCard>
            </Container>
        </div>
    );
};

export default HelpCenterPage;
