import React from 'react';
import { GlassCard } from '../Person/GlassContainer';
import { Typography } from "@material-tailwind/react";
import {
    Activity,
    Heart,
    Footprints,
    Flame,
    Moon,
    Droplet
} from 'lucide-react';
import { motion } from 'framer-motion';

const HealthPage = () => {
    // Dummy Data for now
    const stats = [
        { label: "Steps", value: "8,432", goal: "10,000", icon: <Footprints size={20} />, color: "text-green-400", bg: "bg-green-500/20" },
        { label: "Heart Rate", value: "72 bpm", goal: "RHR: 58", icon: <Heart size={20} />, color: "text-red-400", bg: "bg-red-500/20" },
        { label: "Calories", value: "1,850", goal: "2,200", icon: <Flame size={20} />, color: "text-orange-400", bg: "bg-orange-500/20" },
        { label: "Sleep", value: "7h 12m", goal: "8h 00m", icon: <Moon size={20} />, color: "text-indigo-400", bg: "bg-indigo-500/20" },
    ];

    const commonProps = {
        placeholder: undefined,
        onPointerEnterCapture: undefined,
        onPointerLeaveCapture: undefined,
        onResize: undefined,
        onResizeCapture: undefined,
    } as any;

    return (
        <div className="min-h-screen p-4 md:p-8 space-y-8 animate-fade-in-up pb-24">
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-red-500 text-white rounded-2xl shadow-xl shadow-red-200">
                        <Activity size={24} />
                    </div>
                    <div>
                        <Typography variant="h3" className="text-white font-extrabold tracking-tight" {...commonProps}>
                            Health Overview
                        </Typography>
                        <div className="flex items-center gap-2 text-white font-medium">
                            <Heart size={14} className="text-red-400" />
                            <span>Daily Vitals</span>
                            <span className="text-white/40">|</span>
                            <span>Updated just now</span>
                        </div>
                    </div>
                </div>
            </header>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, i) => (
                    <GlassCard key={i} className="p-6 transition-transform hover:-translate-y-1">
                        <div className="flex items-center justify-between mb-4">
                            <div className={`p-2 rounded-lg ${stat.bg} ${stat.color}`}>
                                {stat.icon}
                            </div>
                            <span className="text-[10px] font-black text-white/40 bg-white/5 px-2 py-0.5 rounded-full tracking-tighter">DAILY GOAL</span>
                        </div>
                        <Typography variant="h4" className="text-white font-bold" {...commonProps}>{stat.value}</Typography>
                        <div className="flex justify-between items-center mt-2">
                            <Typography className="text-white/60 text-sm font-medium" {...commonProps}>{stat.label}</Typography>
                            <Typography className="text-white/40 text-xs font-medium" {...commonProps}>Goal: {stat.goal}</Typography>
                        </div>
                    </GlassCard>
                ))}
            </div>

            {/* Detailed Charts / Trends (Placeholder) */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                    <GlassCard className="p-6 min-h-[400px]">
                        <div className="flex justify-between items-center mb-6">
                            <Typography variant="h5" className="text-white font-bold" {...commonProps}>Activity Trends</Typography>
                            <div className="flex gap-2">
                                <button className="px-3 py-1 rounded-lg bg-white/10 text-white text-xs font-bold hover:bg-white/20 transition-colors">Week</button>
                                <button className="px-3 py-1 rounded-lg text-white/40 text-xs font-bold hover:text-white transition-colors">Month</button>
                            </div>
                        </div>
                        {/* Fake Chart */}
                        <div className="h-64 flex items-end justify-between gap-4 px-2">
                            {[40, 65, 55, 80, 45, 90, 75].map((h, i) => (
                                <div key={i} className="flex-1 bg-white/5 rounded-t-lg relative group h-full flex items-end">
                                    <motion.div
                                        initial={{ height: 0 }}
                                        animate={{ height: `${h}%` }}
                                        transition={{ duration: 0.8, delay: i * 0.1 }}
                                        className="w-full bg-linear-to-t from-green-500 to-green-300 rounded-t-lg opacity-80 group-hover:opacity-100 transition-opacity"
                                    />
                                </div>
                            ))}
                        </div>
                        <div className="flex justify-between mt-4 text-white/40 text-xs font-bold uppercase tracking-wider px-2">
                            <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
                        </div>
                    </GlassCard>
                </div>

                <div className="space-y-8">
                    {/* Hydration Widget */}
                    <GlassCard className="p-6 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-10">
                            <Droplet size={120} />
                        </div>
                        <div className="relative z-10">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-2 bg-blue-500/20 text-blue-400 rounded-lg">
                                    <Droplet size={20} />
                                </div>
                                <Typography variant="h6" className="text-white font-bold" {...commonProps}>Hydration</Typography>
                            </div>
                            <div className="flex items-end gap-2 mb-2">
                                <Typography variant="h3" className="text-white font-bold" {...commonProps}>1,250</Typography>
                                <Typography className="text-white/60 text-sm font-medium mb-1.5" {...commonProps}>/ 2,500 ml</Typography>
                            </div>
                            <div className="h-3 bg-white/10 rounded-full overflow-hidden">
                                <motion.div
                                    className="h-full bg-blue-500 rounded-full"
                                    initial={{ width: 0 }}
                                    animate={{ width: '50%' }}
                                    transition={{ duration: 1 }}
                                />
                            </div>
                            <div className="mt-6 flex justify-center">
                                <button className="px-6 py-2 bg-blue-500 hover:bg-blue-400 text-white font-bold rounded-xl shadow-lg shadow-blue-500/20 transition-all active:scale-95 flex items-center gap-2">
                                    <Droplet size={16} fill="currentColor" />
                                    Add 250ml
                                </button>
                            </div>
                        </div>
                    </GlassCard>
                </div>
            </div>
        </div>
    );
};

export default HealthPage;
