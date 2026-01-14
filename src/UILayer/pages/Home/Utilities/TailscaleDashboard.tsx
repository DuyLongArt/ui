import React, { useEffect } from 'react';
import { Typography, Chip, IconButton, Button, Tooltip } from "@material-tailwind/react";
import { GlassCard } from '../Person/GlassContainer';
import {
    Network,
    RefreshCw,
    Monitor,
    Smartphone,
    Server,
    ChevronRight,
    Activity,
    Shield,
    Globe,
    Clock
} from 'lucide-react';
import { useTailScaleStore } from '../../../../OrchestraLayer/StateManager/Zustand/tailscaleStore';

const TailscaleDashboard = () => {
    const { devices, fetchDevices } = useTailScaleStore();

    useEffect(() => {
        fetchDevices();
    }, [fetchDevices]);

    const commonProps = {
        placeholder: undefined,
        onPointerEnterCapture: undefined,
        onPointerLeaveCapture: undefined,
        onResize: undefined,
        onResizeCapture: undefined,
    } as any;

    const stats = {
        total: devices.length,
        online: devices.filter(d => d.connectedToControl).length,
        offline: devices.filter(d => !d.connectedToControl).length,
    };

    const getOsIcon = (os: string) => {
        const lowerOs = os.toLowerCase();
        if (lowerOs.includes('mac')) return <Monitor size={18} className="text-blue-400" />;
        if (lowerOs.includes('ios') || lowerOs.includes('android')) return <Smartphone size={18} className="text-green-400" />;
        if (lowerOs.includes('linux') || lowerOs.includes('bsd')) return <Server size={18} className="text-purple-400" />;
        return <Monitor size={18} className="text-white" />;
    };

    const formatLastSeen = (dateStr: string) => {
        const date = new Date(dateStr);
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMins / 60);
        const diffDays = Math.floor(diffHours / 24);

        if (diffMins < 1) return 'Just now';
        if (diffMins < 60) return `${diffMins}m ago`;
        if (diffHours < 24) return `${diffHours}h ago`;
        return `${diffDays}d ago`;
    };

    return (
        <div className="space-y-8 animate-fade-in-up">
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <div className="flex items-center gap-3 mb-1">
                        <div className="p-2 bg-indigo-500 text-white rounded-xl shadow-lg shadow-indigo-200">
                            <Network size={20} />
                        </div>
                        <Typography variant="h3" className="text-white font-extrabold tracking-tight" {...commonProps}>
                            Tailscale Mesh Network
                        </Typography>
                    </div>
                    <Typography className="text-white font-medium ml-12" {...commonProps}>
                        Global secure overlay network monitoring and management.
                    </Typography>
                </div>
                <div className="flex items-center gap-3">
                    <Button
                        size="sm"
                        variant="text"
                        onClick={fetchDevices}
                        className="flex items-center gap-2 text-indigo-600 font-bold hover:bg-indigo-50"
                        {...commonProps}
                    >
                        <RefreshCw size={16} /> Refresh Nodes
                    </Button>
                    <Chip
                        value={`${stats.online} ONLINE`}
                        className="bg-green-500/10 text-green-600 font-black rounded-full text-[10px]"
                    />
                </div>
            </header>

            {/* Network Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <GlassCard className="p-6 border-l-4 border-indigo-500">
                    <div className="flex justify-between items-start">
                        <div>
                            <Typography className="text-white text-[10px] font-black uppercase tracking-widest mb-1" {...commonProps}>Total Nodes</Typography>
                            <Typography variant="h2" className="text-white font-black" {...commonProps}>{stats.total}</Typography>
                        </div>
                        <div className="p-3 bg-indigo-50 text-indigo-500 rounded-2xl">
                            <Globe size={24} />
                        </div>
                    </div>
                    <div className="mt-4 flex items-center gap-2 text-xs font-bold text-white">
                        <span className="text-green-500 underline decoration-2 underline-offset-4">Active Session</span>
                        <span>•</span>
                        <span>{stats.total > 0 ? 'Overlay Running' : 'No nodes found'}</span>
                    </div>
                </GlassCard>

                <GlassCard className="p-6 border-l-4 border-green-500">
                    <div className="flex justify-between items-start">
                        <div>
                            <Typography className="text-white text-[10px] font-black uppercase tracking-widest mb-1" {...commonProps}>Live Connections</Typography>
                            <Typography variant="h2" className="text-green-600 font-black" {...commonProps}>{stats.online}</Typography>
                        </div>
                        <div className="p-3 bg-green-50 text-green-500 rounded-2xl">
                            <Activity size={24} />
                        </div>
                    </div>
                    <div className="mt-4 flex items-center gap-1.5 h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-green-500 rounded-full transition-all duration-1000"
                            style={{ width: `${(stats.online / stats.total) * 100}%` }}
                        />
                    </div>
                </GlassCard>

                <GlassCard className="p-6 border-l-4 border-blue-500">
                    <div className="flex justify-between items-start">
                        <div>
                            <Typography className="text-white text-[10px] font-black uppercase tracking-widest mb-1" {...commonProps}>Network Identity</Typography>
                            <Typography variant="h4" className="text-white font-black mt-2" {...commonProps}>tail82c7eb</Typography>
                        </div>
                        <div className="p-3 bg-blue-50 text-blue-500 rounded-2xl">
                            <Shield size={24} />
                        </div>
                    </div>
                    <Typography className="mt-4 text-[10px] font-bold text-white truncate" {...commonProps}>
                        Auth: tskey-api-kJf687...
                    </Typography>
                </GlassCard>
            </div>

            {/* Node List Table */}
            <GlassCard className="overflow-hidden">
                <div className="p-6 border-b border-slate-100/50 flex justify-between items-center bg-white/30 backdrop-blur-xl">
                    <Typography variant="h5" className="text-white font-black" {...commonProps}>Mesh Nodes</Typography>
                    <div className="flex gap-2">
                        <span className="px-2.5 py-1 bg-slate-100 text-[10px] font-bold text-white rounded-lg">ALL SYSTEMS NORMAL</span>
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full min-w-max table-auto text-left">
                        <thead>
                            <tr className="bg-slate-50/50">
                                {["Node Name", "IP Address", "Status", "Platform", "Last Seen", ""].map((head) => (
                                    <th key={head} className="p-4 border-b border-slate-100/50">
                                        <Typography className="text-[10px] font-black text-white uppercase tracking-widest" {...commonProps}>
                                            {head}
                                        </Typography>
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100/30">
                            {devices.map((device, index) => (
                                <tr key={device.id} className="hover:bg-slate-50/40 transition-colors group">
                                    <td className="p-4">
                                        <div className="flex flex-col">
                                            <Typography className="text-sm font-black text-white group-hover:text-indigo-600 transition-colors" {...commonProps}>
                                                {device.hostname}
                                            </Typography>
                                            <Typography className="text-[10px] font-medium text-white" {...commonProps}>
                                                {device.name}
                                            </Typography>
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <code className="text-[11px] font-mono bg-white/50 px-2 py-1 rounded-lg border border-slate-200/50 text-white">
                                            {device.addresses[0]}
                                        </code>
                                    </td>
                                    <td className="p-4">
                                        <div className="flex items-center gap-2">
                                            <div className={`w-2 h-2 rounded-full ${device.connectedToControl ? 'bg-green-500 animate-pulse' : 'bg-slate-300'}`}></div>
                                            <Typography className={`text-[11px] font-bold ${device.connectedToControl ? 'text-green-600' : 'text-white'}`} {...commonProps}>
                                                {device.connectedToControl ? 'CONNECTED' : 'OFFLINE'}
                                            </Typography>
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <div className="flex items-center gap-2">
                                            {getOsIcon(device.os)}
                                            <Typography className="text-xs font-bold text-white" {...commonProps}>
                                                {device.os} <span className="text-[9px] text-white ml-1">v{device.clientVersion}</span>
                                            </Typography>
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <div className="flex items-center gap-2 text-white">
                                            <Clock size={14} className="opacity-40" />
                                            <Typography className="text-[11px] font-bold" {...commonProps}>
                                                {device.connectedToControl ? 'Online Now' : formatLastSeen(device.lastSeen)}
                                            </Typography>
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <IconButton variant="text" size="sm" className="text-white hover:text-indigo-500" {...commonProps}>
                                            <ChevronRight size={18} />
                                        </IconButton>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </GlassCard>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <GlassCard className="p-6 bg-linear-to-br from-indigo-500 to-indigo-700 text-white border-none">
                    <div className="flex justify-between items-start mb-6">
                        <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-md">
                            <Shield size={24} />
                        </div>
                        <span className="px-2 py-1 bg-white/20 rounded text-[10px] font-black uppercase tracking-widest">Enforced</span>
                    </div>
                    <Typography variant="h5" className="font-black mb-2" {...commonProps}>Network Isolation</Typography>
                    <Typography className="text-indigo-100 text-sm mb-6 font-medium leading-relaxed" {...commonProps}>
                        Nodes are isolated using wireguard-based ACLs. Only authorized services can communicate cross-node.
                    </Typography>
                    <Button variant="white" size="sm" className="text-indigo-600 font-black rounded-lg" {...commonProps}>
                        MANAGE ACLs
                    </Button>
                </GlassCard>

                <GlassCard className="p-6 relative overflow-hidden group border-slate-100">
                    <div className="absolute -top-10 -right-10 p-10 opacity-5 group-hover:opacity-10 transition-opacity">
                        <Globe size={200} />
                    </div>
                    <Typography variant="h5" className="text-black font-black mb-4" {...commonProps}>Subnet Routers</Typography>
                    {/* <div className="space-y-4">
                        <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
                            <div className="flex items-center gap-3">
                                <Server size={18} className="text-indigo-500" />
                                <span className="text-sm font-bold text-white">truenas-scale</span>
                            </div>
                            <Chip value="192.168.1.0/24" className="bg-indigo-50 text-indigo-600 text-[10px] font-black rounded" />
                        </div>
                        <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
                            <div className="flex items-center gap-3">
                                <Server size={18} className="text-indigo-500" />
                                <span className="text-sm font-bold text-white">gatewaynas</span>
                            </div>
                            <Chip value="10.0.0.0/16" className="bg-indigo-50 text-indigo-600 text-[10px] font-black rounded" />
                        </div> */}
                    {/* </div> */}
                    <button className="w-full mt-6 py-2 text-xs font-black text-white uppercase tracking-widest hover:text-indigo-600 transition-colors">
                        View Exit Nodes →
                    </button>
                </GlassCard>
            </div>
        </div>
    );
};

export default TailscaleDashboard;
