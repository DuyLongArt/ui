import React from 'react';
import { Typography, Progress } from "@material-tailwind/react";
import { GlassCard } from '../Person/GlassContainer';
import {
    Database,
    HardDrive,
    Share2,
    ShieldCheck,
    CloudIcon,
    Clock,
    Plus,
    Settings,
    ArrowRight,
    Activity,
    Network
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const UtilitiesDashboardPage = () => {
    const navigate = useNavigate();

    const commonProps = {
        placeholder: undefined,
        onPointerEnterCapture: undefined,
        onPointerLeaveCapture: undefined,
        onResize: undefined,
        onResizeCapture: undefined,
    } as any;

    const stats = [
        { label: "Total Storage", value: "256 GB", icon: <Database size={20} />, color: "text-blue-400", bg: "bg-blue-500/20" },
        { label: "Used Space", value: "142 GB", icon: <HardDrive size={20} />, color: "text-purple-400", bg: "bg-purple-500/20" },
        { label: "Shared Files", value: "12", icon: <Share2 size={20} />, color: "text-green-400", bg: "bg-green-500/20" },
        { label: "System Status", value: "Healthy", icon: <ShieldCheck size={20} />, color: "text-orange-400", bg: "bg-orange-500/20" },
    ];

    const services = [
        {
            title: "Cloudflare DNS",
            description: "Advanced DNS analytics and traffic traffic insights for duylong.art.",
            icon: <CloudIcon size={24} />,
            path: "/utilities/index/cloudflare",
            usage: 88
        },
        {
            title: "Tailscale Network",
            description: "Monitor and manage your secure overlay mesh network nodes.",
            icon: <Network size={24} />,
            path: "/utilities/index/tailscale",
            usage: 100
        },
        {
            title: "Cloud Storage",
            description: "Manage your files and media in a secure cloud environment.",
            icon: <CloudIcon size={24} />,
            path: "/utilities/index/storage",
            usage: 65
        },
        {
            title: "System Logs",
            description: "Review automated system actions and security alerts.",
            icon: <Clock size={24} />,
            path: "#",
            usage: 40
        }
    ];

    return (
        <div className="space-y-8 animate-fade-in-up">
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <Typography variant="h3" className="text-white font-bold tracking-tight" {...commonProps}>
                        Utilities Control Center
                    </Typography>
                    <Typography className="text-white/80 font-medium" {...commonProps}>
                        Manage your system services and cloud assets.
                    </Typography>
                </div>
                <div className="flex gap-2">
                    <span className="px-4 py-2 bg-white/20 backdrop-blur-md rounded-full text-xs font-bold text-white border border-white/30 shadow-sm uppercase tracking-wider">
                        Main Server: Online
                    </span>
                </div>
            </header>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, i) => (
                    <GlassCard key={i} className="p-6">
                        <div className="flex items-center justify-between mb-4">
                            <div className={`p-2 rounded-lg ${stat.bg} ${stat.color}`}>
                                {stat.icon}
                            </div>
                            <span className="text-[10px] font-black text-white/40 bg-white/5 px-2 py-0.5 rounded-full tracking-tighter">METRIC</span>
                        </div>
                        <Typography variant="h4" className="text-white font-bold" {...commonProps}>{stat.value}</Typography>
                        <Typography className="text-white/60 text-sm font-medium" {...commonProps}>{stat.label}</Typography>
                    </GlassCard>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Available Services & Load */}
                <div className="lg:col-span-2 space-y-8">

                    {/* Load Chart */}
                    <GlassCard className="p-8 min-h-[300px]">
                        <div className="flex justify-between items-center mb-8">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-blue-500/20 text-blue-400 rounded-lg">
                                    <Activity size={20} />
                                </div>
                                <Typography variant="h5" className="text-white font-bold" {...commonProps}>Server Load Distribution</Typography>
                            </div>
                            <span className="text-[10px] font-black text-white/40 bg-white/5 px-2 py-1 rounded-md tracking-widest uppercase">Real-time</span>
                        </div>

                        <div className="h-48 flex items-end justify-between gap-2 px-4">
                            {[65, 45, 75, 55, 90, 40, 60, 85, 50, 70, 45, 80].map((h, i) => (
                                <div key={i} className="flex-1 bg-white/5 rounded-t-lg relative group h-full flex items-end">
                                    <div
                                        className="w-full bg-linear-to-t from-blue-500 to-blue-300 rounded-t-lg transition-all duration-1000 group-hover:from-blue-400 group-hover:to-blue-200"
                                        style={{ height: `${h}%` }}
                                    ></div>
                                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-white text-white text-[10px] py-1 px-1.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 font-bold">
                                        Core {i + 1}: {h}%
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="flex justify-between mt-4 text-[10px] font-bold text-white/40 uppercase tracking-widest px-2">
                            <span>Primary Nodes</span>
                            <span>Scale Cluster</span>
                            <span>Edge Nodes</span>
                        </div>
                    </GlassCard>

                    <div className="space-y-6">
                        <div className="flex justify-between items-center">
                            <Typography variant="h5" className="text-white font-bold" {...commonProps}>Active Services</Typography>
                            <button className="text-blue-400 text-sm font-bold flex items-center gap-1 hover:underline active:scale-95 transition-transform">
                                <Plus size={16} /> Add service
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {services.map((service, i) => (
                                <GlassCard
                                    key={i}
                                    className="p-6 cursor-pointer group hover:-translate-y-1"
                                    onClick={() => service.path !== "#" && navigate(service.path)}
                                >
                                    <div className="flex items-start justify-between mb-6">
                                        <div className="p-3 bg-white/10 text-white rounded-xl group-hover:bg-blue-500 group-hover:text-white transition-all duration-300 shadow-sm">
                                            {service.icon}
                                        </div>
                                        <ArrowRight size={20} className="text-white/30 group-hover:text-blue-400 transition-all translate-x-0 group-hover:translate-x-1" />
                                    </div>
                                    <Typography variant="h6" className="text-white font-bold mb-2 tracking-tight" {...commonProps}>
                                        {service.title}
                                    </Typography>
                                    <Typography className="text-white/60 text-sm mb-6 line-clamp-2 leading-relaxed" {...commonProps}>
                                        {service.description}
                                    </Typography>
                                    <div className="space-y-2">
                                        <div className="flex justify-between text-[10px] font-black tracking-widest text-white/40 uppercase">
                                            <span>Usage</span>
                                            <span>{service.usage}%</span>
                                        </div>
                                        <Progress
                                            value={service.usage}
                                            size="sm"
                                            color="blue"
                                            className="bg-white/10"
                                            {...commonProps}
                                        />
                                    </div>
                                </GlassCard>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Sidebar: Quick Config & Recent */}
                <div className="space-y-8">
                    <GlassCard className="p-6">
                        <Typography variant="h6" className="text-white font-bold mb-6" {...commonProps}>Infrastructure Health</Typography>
                        <div className="space-y-5">
                            {[
                                { name: "PostgreSQL DB", status: "Operational", color: "bg-green-500" },
                                { name: "MinIO Storage", status: "Operational", color: "bg-green-500" },
                                { name: "JWT Auth Flow", status: "Operational", color: "bg-green-500" },
                                { name: "API Gateway", status: "Operational", color: "bg-green-500" },
                                { name: "Vite Dev Server", status: "Operational", color: "bg-green-500" },
                            ].map((item, i) => (
                                <div key={i} className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-2 h-2 rounded-full ${item.color} animate-pulse`}></div>
                                        <span className="text-sm font-semibold text-white/90">{item.name}</span>
                                    </div>
                                    <span className="text-[10px] font-black text-white/40 uppercase tracking-tighter">{item.status}</span>
                                </div>
                            ))}
                        </div>
                    </GlassCard>

                    <GlassCard className="p-6">
                        <div className="flex items-center gap-3 mb-6">
                            <Settings size={20} className="text-white/70" />
                            <Typography variant="h6" className="text-white font-bold" {...commonProps}>Security Management</Typography>
                        </div>
                        <div className="space-y-3">
                            <button className="w-full py-2.5 px-4 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-xl text-xs font-bold transition-all active:scale-[0.98] border border-red-500/20">
                                Flush Session Cache
                            </button>
                            <button className="w-full py-2.5 px-4 bg-white/5 hover:bg-white/10 text-white rounded-xl text-xs font-bold transition-all active:scale-[0.98] border border-white/10">
                                View Security Audit
                            </button>
                        </div>
                    </GlassCard>
                </div>
            </div>
        </div>
    );
};

export { UtilitiesDashboardPage };
export default UtilitiesDashboardPage;