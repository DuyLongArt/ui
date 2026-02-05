import React, { useMemo, useEffect } from 'react';
import { Typography, Progress, Button } from "@material-tailwind/react";
import { GlassCard } from '../Person/GlassContainer';
import { useUserProfileStore } from '../../../../OrchestraLayer/StateManager/Zustand/userProfileStore';
import { CassettePlayer } from "../../../components/NostagiaComponent/CassettePlayer";
import { VinylRecord } from "../../../components/NostagiaComponent/VinylRecord";
import {
    Activity,
    Users,
    Eye,
    Music,
    TrendingUp,
    Cloud,
    Globe,
    Network,
    ChevronRight,
    Shield,
    HardDrive
} from 'lucide-react';
import { useCloudflareStore } from '../../../../OrchestraLayer/StateManager/Zustand/cloudFlareStore';
import { useTailScaleStore } from '../../../../OrchestraLayer/StateManager/Zustand/tailscaleStore';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import LiquidGlassCard from '../../../components/LiquidGlassCard';
import ColorGlassCard from '@/UILayer/components/ColorGlassCard';
import { useTruenasStorageStore } from '@/OrchestraLayer/StateManager/Zustand/truenasStorageStore';
import { useCloudflareDnsDataQuery } from '@/DataLayer/APILayer/infrastructureQueries';

const DashboardPage = () => {
    const navigate = useNavigate();
    const userStore = useUserProfileStore();
    const { dnsData } = useCloudflareStore();
    const { devices } = useTailScaleStore();
    const userFirstName = userStore.information.profiles.firstName || "Guest";

    const truenasStorageStore = useTruenasStorageStore();

    useEffect(() => {
        truenasStorageStore.setPercentage();
    }, [truenasStorageStore.pools]);

    // Analytics Calculation for the chart
    const analytics = useMemo(() => {
        const dateMap: Record<string, number> = {};
        const nameMap: Record<string, number> = {};
        let totalRequests = 0;

        dnsData.forEach(item => {
            totalRequests += item.count;
            dateMap[item.dimensions.date] = (dateMap[item.dimensions.date] || 0) + item.count;
            nameMap[item.dimensions.queryName] = (nameMap[item.dimensions.queryName] || 0) + item.count;
        });

        const timeline = Object.entries(dateMap).sort((a, b) => a[0].localeCompare(b[0])).slice(-7);
        const topNames = Object.entries(nameMap).sort((a, b) => b[1] - a[1]).slice(0, 4);

        return { totalRequests, timeline, topNames };
    }, [dnsData]);

    const onlineNodes = useMemo(() => devices.filter(d => d.connectedToControl).length, [devices]);
    const maxCount = Math.max(...analytics.timeline.map(t => t[1]), 1);

    const stats = [
        {
            label: "DNS Queries",
            value: analytics.totalRequests.toLocaleString(),
            icon: <Cloud size={20} />,
            color: "text-orange-600",
            bg: "bg-orange-50",
            trend: "+12%"
        },
        {
            label: "Mesh Nodes",
            value: `${onlineNodes}/${devices.length}`,
            icon: <Network size={20} />,
            color: "text-indigo-600",
            bg: "bg-indigo-50",
            trend: "Active"
        },
        {
            label: "Storage Health",
            value: `${(truenasStorageStore.percentageUsed[0] * 100).toFixed(2)}%`,
            status: `${(truenasStorageStore.pools[0].size / 1024 / 1024 / 1024).toFixed(2)}GB`,
            icon: <HardDrive size={20} />,
            color: "text-green-600",
            bg: "bg-green-50",
            trend: `${truenasStorageStore.pools[0].status}`
        },
        {
            label: "Threats Blocked",
            value: "NaN",
            icon: <Shield size={20} />,
            color: "text-blue-600",
            bg: "bg-blue-50",
            trend: "Global"
        },
    ];

    // Common props to fix TS errors with Material Tailwind
    const commonProps = {
        placeholder: undefined,
        onPointerEnterCapture: undefined,
        onPointerLeaveCapture: undefined,
        onResize: undefined,
        onResizeCapture: undefined,
    } as any;

    return (
        <div className="min-h-screen w-full px-3 py-2 sm:p-4 md:p-8 space-y-3 sm:space-y-6 md:space-y-8 bg-linear-to-br! from-indigo-50! to-indigo-300! backdrop-blur-sm animate-fade-in-up pb-24">

            {/* Header Greeting */}
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-1 sm:gap-4">
                <div>
                    <Typography variant="h3" className="text-black font-bold tracking-tight text-xl sm:text-3xl md:text-4xl" {...commonProps}>
                        Welcome back, {userFirstName}!
                    </Typography>
                    <Typography className="text-black text-xs sm:text-base font-medium" {...commonProps}>
                        System status: <span className="text-green-600 font-bold">All operational</span>
                    </Typography>
                </div>
                <div className="flex gap-4 items-center">
                    <span className="px-4 py-2 bg-white/50 backdrop-blur-md rounded-full text-md font-semibold text-black border border-white/60 shadow-sm">
                        {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                    </span>
                </div>
            </header>

            <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
                {stats.map((stat, i) => (
                    <GlassCard key={i} className="p-3 sm:p-6 transition-transform hover:-translate-y-1">
                        <div className="flex items-center justify-between mb-1 sm:mb-4">
                            <div className={`p-1 sm:p-2 rounded-lg ${stat.bg} ${stat.color}`}>
                                {React.cloneElement(stat.icon as React.ReactElement<any>, { size: 16 })}
                            </div>
                            <span className="text-[8px] sm:text-[10px] font-black text-white uppercase tracking-widest">{stat.trend}</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <Typography variant="h4" className="text-white font-black text-lg sm:text-2xl" {...commonProps}>{stat.value}</Typography>
                            <Typography className="text-white text-[9px] sm:text-xs font-bold uppercase tracking-wider" {...commonProps}>{stat.status}</Typography>
                        </div>

                        <Typography className="text-white text-[9px] sm:text-xs font-bold uppercase tracking-wider" {...commonProps}>{stat.label}</Typography>

                    </GlassCard>
                ))}
            </div>


            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-6 gap-8">

                {/* Activity / Main Section */}
                <div className="lg:col-span-2 space-y-8">
                    <ColorGlassCard className="p-6 min-h-[400px]">
                        <div className="flex justify-between items-center mb-8">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-orange-500 text-white rounded-lg shadow-lg shadow-orange-100">
                                    <Cloud size={20} />
                                </div>
                                <div>
                                    <Typography variant="h5" className="text-white font-bold" {...commonProps}>DNS Traffic in 7 days</Typography>
                                    <Typography className="text-white text-xs font-bold" {...commonProps}>Zone: duylong.art</Typography>
                                </div>
                            </div>
                            <button
                                className="text-orange-500  text-xs! tracking-widest uppercase hover:bg-orange-50"
                                onClick={() => navigate('/utilities/index/cloudflare')}
                                {...commonProps}
                            >
                                View Detailed Report →
                            </button>
                        </div>

                        {/* Real DNS Traffic Chart */}
                        <div className="h-64 flex items-end justify-between gap-8 px-4">
                            {analytics.timeline.map(([date, count], i) => {
                                const height = (count / maxCount) * 100;
                                return (
                                    <div key={date} className="flex-1 bg-slate-50/50 rounded-t-xl relative group h-full flex items-end">
                                        <motion.div
                                            initial={{ height: 0 }}
                                            animate={{ height: `${height}%` }}
                                            transition={{ duration: 1, delay: i * 0.1 }}
                                            className="w-full bg-linear-to-t from-orange-500 to-orange-400 rounded-t-xl transition-all duration-300 group-hover:from-orange-600 relative overflow-hidden"
                                        >
                                            <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                        </motion.div>
                                        <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[10px] py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity font-bold whitespace-nowrap z-10">
                                            {count} Queries
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                        <div className="flex justify-between mt-4 text-[10px] text-white font-black uppercase tracking-widest px-2">
                            {analytics.timeline.map(([date]) => (
                                <span key={date}>{date.split('-').slice(1).join('/')}</span>
                            ))}
                        </div>
                    </ColorGlassCard>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <GlassCard className="p-6 bg-slate-800 col-span-3 text-white">
                            <Typography variant="h6" className="font-bold mb-6" {...commonProps}>Top Subdomains</Typography>
                            <div className="space-y-5">
                                {analytics.topNames.map(([name, count]) => (
                                    <div key={name} className="flex justify-between items-center">
                                        <div className="flex items-center gap-2">
                                            <Globe size={14} className="text-orange-400" />
                                            <span className="text-xs font-mono text-white/80 truncate max-w-[140px]">{name}</span>
                                        </div>
                                        <span className="text-[10px] font-black text-white/40">{count} REQS</span>
                                    </div>
                                ))}
                            </div>
                        </GlassCard>
                    </div>
                </div>

                {/* Sidebar / Extended Detail */}
                <div className="space-y-8 col-span-1">


                    {/* Mesh Network Snapshot */}
                    <LiquidGlassCard
                        containerClassName="w-full"
                        className="p-6 border-white/30"
                        blobColor="bg-indigo-500/40"
                    >
                        <div className="flex justify-between items-center mb-6">
                            <Typography variant="h6" className="text-black/60 font-bold" {...commonProps}>Mesh Host</Typography>
                            <span className="px-2 py-1 bg-green-500/20 text-green-400 text-[9px] font-black rounded border border-green-500/30">STABLE</span>
                        </div>
                        <div className="space-y-4">
                            {devices.slice(0, 5).map(device => (
                                <div key={device.id} className="flex items-center justify-between group">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-2 h-2 rounded-full ${device.connectedToControl ? 'bg-green-400 animate-pulse shadow-[0_0_8px_rgba(74,222,128,0.5)]' : 'bg-white/20'}`} />
                                        <span className="text-xs font-bold text-white/90 group-hover:text-white transition-colors uppercase tracking-tight">{device.hostname}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <button
                            className="mt-6 text-white/60 hover:text-white font-black text-xs! tracking-widest uppercase transition-colors flex items-center gap-2"
                            onClick={() => navigate('/utilities/index/tailscale')}
                        >
                            Mesh Details <ChevronRight size={14} />
                        </button>
                    </LiquidGlassCard>

                    {/* Top DNS Targets */}


                    <GlassCard className="p-6">
                        <Typography variant="h6" className="text-white font-bold mb-6" {...commonProps}>Recent Activity</Typography>
                        <div className="space-y-6">
                            {[
                                { action: "DNS Policy Updated", time: "2 mins ago", color: "bg-blue-500" },
                                { action: "NAS Snapshot Complete", time: "4 hours ago", color: "bg-green-500" },
                                { action: "New Node: MacDuyLong", time: "Yesterday", color: "bg-purple-500" },
                            ].map((item, i) => (
                                <div key={i} className="flex gap-4 relative">
                                    {i !== 2 && <div className="absolute left-[9px] top-8 bottom-[-24px] w-0.5 bg-slate-100"></div>}
                                    <div className={`w-5 h-5 rounded-full ${item.color} shrink-0 mt-1 ring-4 ring-white`}></div>
                                    <div>
                                        <Typography className="text-white text-xs font-semibold" {...commonProps}>{item.action}</Typography>
                                        <Typography className="text-white text-[10px]" {...commonProps}>{item.time}</Typography>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </GlassCard>
                </div>
            </div>

        </div>
    );
};

export default DashboardPage;
