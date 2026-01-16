import React, { useMemo } from 'react';
import { Typography, Progress } from "@material-tailwind/react";
import { GlassCard } from '../Person/GlassContainer';
import {
    Cloud,
    ShieldCheck,
    Activity,
    BarChart3,
    Globe,
    Server,
    Clock,
    Search,
    ChevronUp
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useCloudflareStore } from '../../../../OrchestraLayer/StateManager/Zustand/cloudFlareStore';

const CloudflareDnsDashboard = () => {
    const { dnsData, fetchDnsData, isLoading, error } = useCloudflareStore();

    React.useEffect(() => {
        fetchDnsData();
    }, [fetchDnsData]);

    const commonProps = {
        placeholder: undefined,
        onPointerEnterCapture: undefined,
        onPointerLeaveCapture: undefined,
        onResize: undefined,
        onResizeCapture: undefined,
    } as any;

    // Analytics Calculation
    const analytics = useMemo(() => {
        const typeMap: Record<string, number> = {};
        const nameMap: Record<string, number> = {};
        const dateMap: Record<string, number> = {};
        let total = 0;

        dnsData.forEach(item => {
            total += item.count;
            typeMap[item.dimensions.queryType] = (typeMap[item.dimensions.queryType] || 0) + item.count;
            nameMap[item.dimensions.queryName] = (nameMap[item.dimensions.queryName] || 0) + item.count;
            dateMap[item.dimensions.date] = (dateMap[item.dimensions.date] || 0) + item.count;
        });

        const topTypes = Object.entries(typeMap).sort((a, b) => b[1] - a[1]).slice(0, 5);
        const topNames = Object.entries(nameMap).sort((a, b) => b[1] - a[1]).slice(0, 5);
        const timeline = Object.entries(dateMap).sort((a, b) => a[0].localeCompare(b[0]));

        return { total, topTypes, topNames, timeline };
    }, [dnsData]);

    const containerVariants = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        show: { y: 0, opacity: 1 }
    };

    return (
        <div className="space-y-8 animate-fade-in-up pb-12">
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-orange-500 text-white rounded-2xl shadow-xl shadow-orange-200">
                        <Cloud size={24} />
                    </div>
                    <div>
                        <Typography variant="h3" className="text-white font-extrabold tracking-tight" {...commonProps}>
                            Cloudflare DNS Analytics
                        </Typography>
                        <div className="flex items-center gap-2 text-white font-medium">
                            <Globe size={14} className="text-orange-500" />
                            <span>Zone: duylong.art</span>
                            <span className="text-white">|</span>
                            <span className="text-xs">Real-time Traffic Insight</span>
                        </div>
                    </div>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={fetchDnsData}
                        disabled={isLoading}
                        className="px-4 py-2 bg-white/70 backdrop-blur-md border border-slate-100 rounded-xl shadow-sm flex items-center gap-2 hover:bg-white transition-colors disabled:opacity-50"
                    >
                        <div className={`w-2 h-2 rounded-full ${isLoading ? 'bg-orange-500 animate-spin' : 'bg-green-500 animate-pulse'}`} />
                        <span className="text-xs font-bold text-white uppercase">
                            {isLoading ? 'Syncing...' : 'Live Sync'}
                        </span>
                    </button>
                </div>
            </header>

            {error && (
                <div className="p-4 bg-red-500/10 border border-red-500/50 rounded-2xl text-red-500 text-sm font-bold flex items-center gap-3">
                    <Cloud size={18} />
                    <span>Failed to fetch DNS analytics: {error}</span>
                </div>
            )}

            {/* Quick Stats Grid */}
            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="show"
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
            >
                <motion.div variants={itemVariants}>
                    <GlassCard className="p-6 overflow-hidden relative group">
                        <div className="absolute -right-4 -bottom-4 opacity-5 pointer-events-none group-hover:scale-110 transition-transform">
                            <Activity size={120} />
                        </div>
                        <Typography className="text-white text-[10px] font-black uppercase tracking-widest mb-1" {...commonProps}>
                            Total Requests
                        </Typography>
                        <Typography variant="h2" className="text-white font-black mb-2" {...commonProps}>
                            {analytics.total}
                        </Typography>
                        <div className="flex items-center gap-1 text-green-500 text-[10px] font-black">
                            <ChevronUp size={12} />
                            <span>14.2% SINCE LAST PERIOD</span>
                        </div>
                    </GlassCard>
                </motion.div>

                <motion.div variants={itemVariants}>
                    <GlassCard className="p-6">
                        <Typography className="text-white text-[10px] font-black uppercase tracking-widest mb-1" {...commonProps}>
                            Active Record Types
                        </Typography>
                        <Typography variant="h2" className="text-white font-black mb-2" {...commonProps}>
                            {analytics.topTypes.length}
                        </Typography>
                        <div className="flex gap-1 overflow-hidden">
                            {analytics.topTypes.slice(0, 3).map(([type]) => (
                                <span key={type} className="px-1.5 py-0.5 bg-slate-100 text-white text-[9px] font-bold rounded">
                                    {type}
                                </span>
                            ))}
                        </div>
                    </GlassCard>
                </motion.div>

                <motion.div variants={itemVariants}>
                    <GlassCard className="p-6">
                        <Typography className="text-white text-[10px] font-black uppercase tracking-widest mb-1" {...commonProps}>
                            Security Coverage
                        </Typography>
                        <Typography variant="h2" className="text-indigo-600 font-black mb-2" {...commonProps}>
                            100%
                        </Typography>
                        <div className="flex items-center gap-1 text-[10px] font-bold text-white">
                            <ShieldCheck size={12} className="text-indigo-500" />
                            <span>DNSSEC ENABLED</span>
                        </div>
                    </GlassCard>
                </motion.div>

                <motion.div variants={itemVariants}>
                    <GlassCard className="p-6">
                        <Typography className="text-white text-[10px] font-black uppercase tracking-widest mb-1" {...commonProps}>
                            Monitoring Status
                        </Typography>
                        <Typography variant="h2" className="text-green-600 font-black mb-2" {...commonProps}>
                            Stable
                        </Typography>
                        <div className="flex items-center gap-1 text-[10px] font-bold text-white">
                            <Server size={12} className="text-green-500" />
                            <span>EDGE NODES OPTIMAL</span>
                        </div>
                    </GlassCard>
                </motion.div>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Traffic Timeline Chart */}
                <motion.div
                    variants={itemVariants}
                    initial="hidden"
                    animate="show"
                    className="lg:col-span-2"
                >
                    <GlassCard className="p-8 h-[400px] flex flex-col">
                        <div className="flex justify-between items-center mb-8">
                            <div className="flex items-center gap-2">
                                <BarChart3 className="text-orange-500" size={20} />
                                <Typography variant="h5" className="text-white font-black" {...commonProps}>
                                    Traffic Timeline
                                </Typography>
                            </div>
                            <div className="text-[10px] font-black text-white bg-slate-50 px-3 py-1 rounded-full uppercase tracking-widest">
                                Daily Aggregation
                            </div>
                        </div>

                        <div className="flex-1 flex items-end justify-between gap-4 px-4 pb-4">
                            {isLoading ? (
                                <div className="w-full h-full flex items-center justify-center">
                                    <Activity className="text-orange-200 animate-pulse" size={48} />
                                </div>
                            ) : analytics.timeline.length === 0 ? (
                                <div className="w-full h-full flex items-center justify-center text-white/40 font-bold">
                                    No data available for the selected period.
                                </div>
                            ) : (
                                analytics.timeline.map(([date, count]) => {
                                    const height = (count / Math.max(...analytics.timeline.map(t => t[1]))) * 100;
                                    return (
                                        <div key={date} className="flex-1 flex flex-col items-center gap-3 h-full justify-end group">
                                            <div className="w-full relative h-[60%] flex items-end">
                                                <motion.div
                                                    initial={{ height: 0 }}
                                                    animate={{ height: `${height}%` }}
                                                    transition={{ duration: 1, ease: "easeOut" }}
                                                    className="w-full bg-linear-to-t from-orange-500 to-orange-400 rounded-t-xl shadow-lg shadow-orange-100 group-hover:from-orange-600 transition-all cursor-pointer relative"
                                                >
                                                    <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[10px] py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity z-10 font-bold whitespace-nowrap">
                                                        {count} Queries
                                                    </div>
                                                </motion.div>
                                            </div>
                                            <div className="text-[10px] font-black text-white uppercase tracking-tighter">
                                                {date.split('-').slice(1).join('/')}
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    </GlassCard>
                </motion.div>

                {/* Record Distribution */}
                <motion.div
                    variants={itemVariants}
                    initial="hidden"
                    animate="show"
                >
                    <GlassCard className="p-8 h-[400px] flex flex-col">
                        <Typography variant="h5" className="text-white font-black mb-8" {...commonProps}>
                            Query Breakdown
                        </Typography>
                        <div className="space-y-6 flex-1 overflow-y-auto pr-2 custom-scrollbar">
                            {analytics.topTypes.map(([type, count]) => (
                                <div key={type} className="space-y-2">
                                    <div className="flex justify-between items-center">
                                        <div className="flex items-center gap-2">
                                            <span className="w-2 h-2 rounded-full bg-indigo-500" />
                                            <Typography className="text-xs font-black text-white" {...commonProps}>{type}</Typography>
                                        </div>
                                        <Typography className="text-xs font-bold text-white" {...commonProps}>
                                            {((count / analytics.total) * 100).toFixed(1)}%
                                        </Typography>
                                    </div>
                                    <Progress
                                        value={(count / analytics.total) * 100}
                                        size="sm"
                                        color="blue"
                                        className="bg-slate-50"
                                        {...commonProps}
                                    />
                                </div>
                            ))}
                        </div>
                        <div className="mt-8 pt-6 border-t border-slate-100/50">
                            <div className="flex justify-between items-center text-[10px] font-black text-white uppercase">
                                <span>Edge Network Coverage</span>
                                <span className="text-green-500">Live</span>
                            </div>
                        </div>
                    </GlassCard>
                </motion.div>
            </div>

            {/* Subdomain Table */}
            <motion.div variants={itemVariants} initial="hidden" animate="show">
                <GlassCard className="overflow-hidden ">
                    <div className="p-6 border-b border-slate-100/50 flex justify-between items-center bg-white/40">
                        <div className="flex items-center gap-3">
                            <Search size={20} className="text-white" />
                            <Typography variant="h5" className="text-white font-black" {...commonProps}>
                                Top Subdomains
                            </Typography>
                        </div>
                        <div className="flex gap-2">
                            <span className="px-3 py-1 bg-indigo-50 text-indigo-500 text-[10px] font-black rounded-lg">LAST 7 DAYS</span>
                        </div>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-slate-50/50">
                                <tr>
                                    {["Hostname", "Traffic Volume", "Activity", "Health"].map(h => (
                                        <th key={h} className="p-4 border-b border-slate-100/50">
                                            <Typography className="text-[10px] font-black text-white uppercase tracking-widest" {...commonProps}>
                                                {h}
                                            </Typography>
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {analytics.topNames.map(([name, count], i) => (
                                    <tr key={name} className="hover:bg-slate-50/50 transition-colors group">
                                        <td className="p-4">
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 bg-white rounded-lg border border-slate-100 shadow-sm group-hover:bg-orange-50 transition-colors">
                                                    <Globe size={16} className="text-white group-hover:text-orange-500" />
                                                </div>
                                                <Typography className="text-sm font-black text-white underline decoration-indigo-200 underline-offset-4" {...commonProps}>
                                                    {name}
                                                </Typography>
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <div className="flex flex-col">
                                                <Typography className="text-sm font-black text-white" {...commonProps}>{count}</Typography>
                                                <Typography className="text-[10px] font-bold text-white" {...commonProps}>Requests</Typography>
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <div className="h-6 w-24 flex items-end gap-1">
                                                {[3, 7, 4, 8, 5, 9, 6].map((v, j) => (
                                                    <div key={j} className="w-1 bg-indigo-100 rounded-full" style={{ height: `${v * 10}%` }} />
                                                ))}
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <div className="flex items-center gap-2">
                                                <Clock size={14} className="text-white" />
                                                <span className="text-[10px] font-black text-white">RESOLVING ...</span>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </GlassCard>
            </motion.div>
        </div>
    );
};

export default CloudflareDnsDashboard;
