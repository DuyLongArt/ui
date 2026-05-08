import React from 'react';
import { Container } from '@mui/material';
import { motion } from 'framer-motion';
import type { Variants } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import LiquidGlassCard from '../../components/LiquidGlassCard';
import { LogIn, UserPlus, Zap } from 'lucide-react';
import cityAtNight from '@assets/city_at_night.png';

const EntryPage: React.FC = () => {
    const navigate = useNavigate();

    const containerVariants: Variants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.15,
                delayChildren: 0.3
            }
        }
    };

    const itemVariants: Variants = {
        hidden: { opacity: 0, y: 30, filter: 'blur(10px)' },
        visible: {
            opacity: 1,
            y: 0,
            filter: 'blur(0px)',
            transition: { type: "spring", stiffness: 100, damping: 20 }
        }
    };

    const floatingVariants: Variants = {
        animate: {
            y: [0, -12, 0],
            rotate: [0, 4, -4, 0],
            transition: {
                duration: 7,
                repeat: Infinity,
                ease: "easeInOut"
            }
        }
    };

    return (
        <div
            className="min-h-screen w-full bg-transparent relative overflow-hidden"
            style={{ fontFamily: "'Times New Roman', Times, serif" }}
        >
            {/* Background image */}
            <div className="absolute inset-0">
                <div
                    className="absolute inset-0 bg-center bg-cover"
                    style={{ backgroundImage: `url(${cityAtNight})` }}
                />
                <div className="absolute inset-0 bg-black/55" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_25%,rgba(99,102,241,0.18),transparent_55%),radial-gradient(circle_at_80%_70%,rgba(34,211,238,0.12),transparent_55%)]" />
            </div>

            <Container maxWidth="sm" className="relative z-10 py-16 md:py-24">
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="flex items-center justify-center"
                >
                    <motion.div variants={itemVariants} className="w-full">
                        <LiquidGlassCard className="p-8 md:p-10 border-white/15 backdrop-blur-3xl shadow-[0_0_60px_rgba(79,70,229,0.20)]">
                            <div className="mt-2 flex flex-col gap-4">
                                <button
                                    type="button"
                                    onClick={() => navigate('/login/index')}
                                    className="group relative flex items-center justify-center gap-3 py-4 px-8 bg-white text-indigo-950 rounded-2xl font-black text-xl transition-all hover:scale-[1.01] active:scale-[0.99] shadow-[0_20px_40px_rgba(255,255,255,0.12)] overflow-hidden"
                                >
                                    <div className="absolute inset-0 bg-linear-to-r from-indigo-50 to-white opacity-0 group-hover:opacity-100 transition-opacity" />
                                    <LogIn size={22} className="relative z-10" />
                                    <span className="relative z-10">Sign in</span>
                                    <Zap size={18} className="relative z-10 opacity-0 group-hover:opacity-100 transition-all group-hover:translate-x-1" />
                                </button>

                                <button
                                    type="button"
                                    onClick={() => navigate('/login/register')}
                                    className="flex items-center justify-center gap-3 py-4 px-8 bg-white/5 text-white border border-white/10 rounded-2xl font-black text-xl backdrop-blur-xl transition-all hover:bg-white/10 hover:border-white/20 active:scale-[0.99]"
                                >
                                    <UserPlus size={22} />
                                    Sign up
                                </button>
                            </div>
                        </LiquidGlassCard>
                    </motion.div>
                </motion.div>
            </Container>
        </div>
    );
};

export default EntryPage;
