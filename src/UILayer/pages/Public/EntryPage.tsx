import React from 'react';
import { Container } from '@mui/material';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import LiquidGlassCard from '../../components/LiquidGlassCard';
import { LogIn, UserPlus, UserCheck } from 'lucide-react';

const EntryPage: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen w-full flex items-center justify-center p-6">
            <Container maxWidth="sm">
                <LiquidGlassCard
                    className="p-10 md:p-14 text-center border-white/30"
                    blobColor="bg-indigo-500/30"
                >
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <h1 className="text-5xl font-black text-white mb-4 tracking-tighter">
                            Welcome
                        </h1>
                        <p className="text-white/70 text-lg mb-10 font-medium">
                            Experience the future of net services with DuyLong Art.
                        </p>
                    </motion.div>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <button
                            onClick={() => navigate('/login/index')}
                            className="flex items-center justify-center gap-2 py-4 px-8 bg-white text-indigo-600 rounded-2xl font-bold text-lg transition-all hover:scale-105 hover:bg-indigo-50 active:scale-95 shadow-xl"
                        >
                            <LogIn size={20} />
                            Login
                        </button>

                        <button
                            onClick={() => navigate('/login/register')}
                            className="flex items-center justify-center gap-2 py-4 px-8 bg-white/10 text-white border border-white/30 rounded-2xl font-bold text-lg backdrop-blur-md transition-all hover:bg-white/20 active:scale-95 shadow-xl"
                        >
                            <UserPlus size={20} />
                            Sign Up
                        </button>

                    </div>

                    <div className="flex flex-col items-center justify-center gap-2 mt-2 mb-4 px-8  text-white rounded-2xl font-bold text-lgactive:scale-95 ">
                        <div className="mt-4 text-blue-900/70 text-3xl font-bold py-4 italic font-family-times-new-roman ">Don't have an account? </div>

                        <button
                            onClick={() => navigate('/personal/index')}
                            className="flex items-center justify-center gap-2 py-4 px-8 bg-white/10 text-white border border-white/30 rounded-2xl font-bold text-lg backdrop-blur-md transition-all hover:bg-white/20 active:scale-95 shadow-xl"
                        >
                            <UserCheck size={20} />
                            Login as VIEWER
                        </button>
                    </div>
                </LiquidGlassCard>
            </Container>
        </div>
    );
};

export default EntryPage;
