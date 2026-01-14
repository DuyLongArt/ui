import React from 'react';
import { motion } from 'framer-motion';
import { Typography, Button } from "@material-tailwind/react";
import { Search, Mic, Calendar, ChevronLeft, ChevronRight, Layout } from 'lucide-react';
import './ReflectTheme.css';

const commonProps = {
    placeholder: undefined,
    onPointerEnterCapture: undefined,
    onPointerLeaveCapture: undefined,
    onResize: undefined,
    onResizeCapture: undefined,
} as any;

export const ReflectHero: React.FC = () => {
    return (
        <div className="relative min-h-screen w-full reflect-bg overflow-hidden flex flex-col items-center">
            {/* Navigation Bar */}
            <nav className="z-20 mt-8 px-6 py-2 glass-pill flex items-center gap-6">
                <div className="w-6 h-6 bg-indigo-500 rounded-sm flex items-center justify-center">
                    <div className="w-3 h-3 border-2 border-white rounded-full"></div>
                </div>
                <div className="flex gap-4 text-sm font-medium text-white">
                    <a href="#" className="hover:text-white transition-colors">Product</a>
                    <a href="#" className="hover:text-white transition-colors">Pricing</a>
                    <a href="#" className="hover:text-white transition-colors">Company</a>
                    <a href="#" className="hover:text-white transition-colors">Blog</a>
                    <a href="#" className="hover:text-white transition-colors">Changelog</a>
                </div>
                <div className="flex items-center gap-4 ml-4">
                    <a href="#" className="text-sm font-medium text-white hover:text-white transition-colors">Login</a>
                    <button className="px-4 py-1.5 rounded-full bg-white/10 text-white text-sm font-medium border border-white/20 hover:bg-white/20 transition-all">
                        Start free trial
                    </button>
                </div>
            </nav>

            {/* Hero Content */}
            <div className="mt-32 z-10 text-center px-4 max-w-4xl">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="mb-6 flex justify-center"
                >
                    <div className="px-4 py-1 glass-pill text-[12px] font-bold text-indigo-300 flex items-center gap-2 border-indigo-500/30">
                        <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-pulse"></span>
                        Take notes using AI
                    </div>
                </motion.div>

                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.1 }}
                    className="text-5xl md:text-7xl font-bold tracking-tight reflect-text-gradient mb-6"
                >
                    Think better with Reflect
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="text-lg md:text-xl text-white max-w-2xl mx-auto mb-12"
                >
                    Never miss a note, idea or connection.
                </motion.p>
            </div>

            {/* Glow/Black Hole Effect */}
            <div className="absolute top-[60%] left-1/2 -translate-x-1/2 w-[1200px] h-[600px] pointer-events-none">
                <div className="glow-circle glow-purple" style={{ top: '20%', width: '1000px', height: '400px' }}></div>
                <div className="glow-circle glow-pink" style={{ top: '30%', width: '800px', height: '300px' }}></div>
                <div className="glow-circle glow-white" style={{ top: '40%', width: '600px', height: '100px' }}></div>

                {/* The "Event Horizon" line */}
                <div className="absolute top-[45%] left-1/2 -translate-x-1/2 w-full h-[2px] bg-linear-to-r from-transparent via-purple-500 to-transparent opacity-50"></div>
                <div className="absolute top-[45%] left-1/2 -translate-x-1/2 w-[80%] h-px bg-linear-to-r from-transparent via-white to-transparent opacity-80"></div>
            </div>

            {/* Bottom App Mockup */}
            <motion.div
                initial={{ opacity: 0, y: 60 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.4 }}
                className="relative z-20 w-full max-w-6xl mt-auto px-4 translate-y-20"
            >
                <div className="glass-pill rounded-t-3xl border-b-0 p-1 bg-black/40 backdrop-blur-3xl border-white/10 min-h-[600px] shadow-[0_-20px_50px_rgba(0,0,0,0.5)]">
                    <div className="flex h-full">
                        {/* Mock Side Nav */}
                        <div className="w-64 border-r border-white/5 p-6 flex flex-col gap-6">
                            <div className="flex items-center gap-3 bg-white/5 rounded-lg p-2 border border-white/10">
                                <Search size={16} className="text-white" />
                                <span className="text-sm text-white">Search anything...</span>
                                <span className="ml-auto text-[10px] bg-white/10 px-1.5 py-0.5 rounded text-white font-mono">⌘K</span>
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-center gap-3 text-indigo-400 font-medium">
                                    <Calendar size={18} />
                                    <span>Daily notes</span>
                                </div>
                                <div className="flex items-center gap-3 text-white">
                                    <Layout size={18} />
                                    <span>All notes</span>
                                </div>
                            </div>
                        </div>

                        {/* Mock Content */}
                        <div className="flex-1 p-8">
                            <div className="flex items-center justify-between mb-8">
                                <div className="flex items-center gap-4">
                                    <h2 className="text-xl font-bold text-white">Sun, April 2nd, 2023</h2>
                                </div>
                                <div className="flex gap-2">
                                    <div className="p-1 rounded hover:bg-white/10 cursor-pointer">
                                        <ChevronLeft size={20} className="text-white" />
                                    </div>
                                    <div className="p-1 rounded hover:bg-white/10 cursor-pointer">
                                        <ChevronRight size={20} className="text-white" />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div className="flex gap-4">
                                    <div className="w-1 bg-indigo-500 rounded-full h-6 shrink-0 mt-1"></div>
                                    <div className="text-white">
                                        Today I started using <span className="text-indigo-400">Reflect!</span>
                                    </div>
                                </div>
                                <div className="pl-5 space-y-4">
                                    <div className="flex gap-3 items-start">
                                        <div className="w-1.5 h-1.5 rounded-full bg-gray-600 mt-2 shrink-0"></div>
                                        <div className="text-white">What is Reflect?</div>
                                    </div>
                                    <div className="pl-6 flex gap-3 items-start">
                                        <div className="w-1.5 h-1.5 rounded-full border border-gray-600 mt-2 shrink-0"></div>
                                        <div className="text-white">A note-taking tool designed to mirror the way we think</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};
