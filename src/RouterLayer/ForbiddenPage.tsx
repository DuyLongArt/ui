import React from 'react';
import { motion } from 'framer-motion';
import { ShieldAlert, ArrowLeft, Home, Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ForbiddenPage = () => {
    const navigate = useNavigate();

    const containerVariants = {
        initial: { opacity: 0, scale: 0.9 },
        animate: {
            opacity: 1,
            scale: 1,
            transition: {
                duration: 0.5,
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 }
    };

    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-linear-to-br from-slate-900 via-indigo-950 to-slate-900 p-6 relative overflow-hidden">
            {/* Dynamic Background Elements */}
            <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-indigo-600/20 rounded-full blur-[120px] animate-pulse" />
            <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }} />

            <motion.div
                variants={containerVariants}
                initial="initial"
                animate="animate"
                className="max-w-lg w-full bg-white/10 backdrop-blur-2xl border border-white/20 rounded-[2.5rem] p-8 md:p-12 shadow-2xl text-center relative z-10"
            >
                {/* Icon Section */}
                <motion.div
                    variants={itemVariants}
                    className="mb-8 flex justify-center"
                >
                    <div className="relative">
                        <div className="absolute inset-0 bg-red-500/20 blur-2xl rounded-full" />
                        <div className="w-24 h-24 bg-linear-to-tr from-red-500 to-rose-400 rounded-3xl flex items-center justify-center shadow-lg transform rotate-12 relative border border-white/30">
                            <ShieldAlert size={48} className="text-white -rotate-12" />
                        </div>
                    </div>
                </motion.div>

                {/* Text Content */}
                <motion.div variants={itemVariants} className="space-y-4">
                    <h1 className="text-4xl font-black text-white tracking-tight leading-tight">
                        Access Restricted
                    </h1>
                    <div className="h-1.5 w-12 bg-indigo-500 mx-auto rounded-full" />
                    <p className="text-indigo-100/80 text-lg font-medium leading-relaxed">
                        It looks like you don't have the necessary permissions to view this section.
                    </p>
                </motion.div>



                {/* Actions */}
                <motion.div
                    variants={itemVariants}
                    className="mt-10 flex flex-col sm:flex-row gap-4"
                >
                    <button
                        onClick={() => navigate(-1)}
                        className="flex-1 flex items-center justify-center gap-2 py-4 px-6 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold rounded-2xl transition-all group"
                    >
                        <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                        Go Back
                    </button>
                    <button
                        onClick={() => navigate('/home/index')}
                        className="flex-1 flex items-center justify-center gap-2 py-4 px-6 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-2xl shadow-lg shadow-indigo-600/30 transition-all hover:-translate-y-1 active:translate-y-0"
                    >
                        <Home size={18} />
                        Return Home
                    </button>
                </motion.div>

            </motion.div>
        </div>
    );
};

export default ForbiddenPage;

