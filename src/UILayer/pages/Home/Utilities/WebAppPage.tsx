import React from 'react';
import {
    LayoutGrid,
    HardDrive,
    Music,
    Network,
    Cloud,
    Server,
    Database,
    Monitor,
    Shield,
    Cpu,
    Globe,
    ExternalLink,
    Terminal
} from 'lucide-react';
import { Typography } from "@material-tailwind/react";
import { GlassCard } from '../Person/GlassContainer';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

interface AppItem {
    id: string;
    title: string;
    description: string;
    icon: React.ReactNode;
    color: string;
    path?: string;
    externalUrl?: string;
    status: 'online' | 'offline' | 'maintenance';
}

const WebAppPage: React.FC = () => {
    const navigate = useNavigate();

    const apps: AppItem[] = [
        // Internal Apps
        {
            id: 'storage',
            title: 'Cloud Storage',
            description: 'Secure file management and object storage browser.',
            icon: <HardDrive size={32} />,
            color: 'text-blue-400',
            path: '/utilities/index/storage',
            status: 'online'
        },
        {
            id: 'music',
            title: 'Music Player',
            description: 'Stream your FLAC library with high-fidelity audio.',
            icon: <Music size={32} />,
            color: 'text-pink-400',
            path: '/utilities/index/music',
            status: 'online'
        },
        {
            id: 'tailscale',
            title: 'Tailscale Mesh',
            description: 'Monitor your secure overlay network and devices.',
            icon: <Network size={32} />,
            color: 'text-indigo-400',
            path: '/utilities/index/tailscale',
            status: 'online'
        },
        {
            id: 'cloudflare',
            title: 'Cloudflare DNS',
            description: 'Manage DNS records and view traffic analytics.',
            icon: <Cloud size={32} />,
            color: 'text-orange-400',
            path: '/utilities/index/cloudflare',
            status: 'online'
        },

        // External Apps (Simulated based on typical homelab setup + router config)
        {
            id: 'nextcloud',
            title: 'Nextcloud',
            description: 'Private cloud productivity and collaboration platform.',
            icon: <Database size={32} />,
            color: 'text-blue-500',
            externalUrl: 'http://192.168.3.1:6699',
            status: 'online'
        },
        {
            id: 'proxmox',
            title: 'Proxmox VE',
            description: 'Virtualization management platform for servers.',
            icon: <Server size={32} />,
            color: 'text-orange-600',
            externalUrl: '#',
            status: 'online'
        },
        {
            id: 'portainer',
            title: 'Portainer',
            description: 'Container management for Docker and Kubernetes.',
            icon: <Cpu size={32} />,
            color: 'text-cyan-400',
            externalUrl: '#',
            status: 'online'
        },
        {
            id: 'pihole',
            title: 'Pi-hole',
            description: 'Network-wide ad blocking and DNS sinkhole.',
            icon: <Shield size={32} />,
            color: 'text-red-400',
            externalUrl: '#',
            status: 'online'
        },
        {
            id: 'grafana',
            title: 'Grafana',
            description: 'Operational dashboards for your infrastructure.',
            icon: <Monitor size={32} />,
            color: 'text-yellow-500',
            externalUrl: '#',
            status: 'maintenance'
        },
        {
            id: 'terminal',
            title: 'Web Terminal',
            description: 'SSH access to your primary gateway server.',
            icon: <Terminal size={32} />,
            color: 'text-green-400',
            externalUrl: '#',
            status: 'offline'
        }
    ];

    const commonProps = {
        placeholder: undefined,
        onPointerEnterCapture: undefined,
        onPointerLeaveCapture: undefined,
        onResize: undefined,
        onResizeCapture: undefined,
    } as any;

    const handleAppClick = (app: AppItem) => {
        if (app.path) {
            navigate(app.path);
        } else if (app.externalUrl) {
            window.open(app.externalUrl, '_blank');
        }
    };

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
        <div className="min-h-screen p-4 md:p-8 space-y-8 animate-fade-in-up pb-20">
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-indigo-500 text-white rounded-2xl shadow-xl shadow-indigo-200">
                        <LayoutGrid size={24} />
                    </div>
                    <div>
                        <Typography variant="h3" className="text-white font-extrabold tracking-tight" {...commonProps}>
                            Application Launcher
                        </Typography>
                        <div className="flex items-center gap-2 text-white font-medium">
                            <Globe size={14} className="text-indigo-400" />
                            <span>System Apps</span>
                            <span className="text-white/40">|</span>
                            <span>{apps.length} Applications Available</span>
                        </div>
                    </div>
                </div>
            </header>

            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="show"
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            >
                {apps.map((app) => (
                    <motion.div key={app.id} variants={itemVariants}>
                        <GlassCard
                            className="h-full p-6 flex flex-col justify-between cursor-pointer group hover:-translate-y-1 hover:bg-white/10"
                            onClick={() => handleAppClick(app)}
                        >
                            <div className="flex justify-between items-start mb-4">
                                <div className={`p-4 rounded-2xl bg-white/5 border border-white/10 ${app.color} group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                                    {app.icon}
                                </div>
                                <div className={`flex items-center gap-1.5 px-2 py-1 rounded-lg border text-[10px] font-black uppercase tracking-wider
                                    ${app.status === 'online' ? 'bg-green-500/10 border-green-500/20 text-green-400' :
                                        app.status === 'maintenance' ? 'bg-yellow-500/10 border-yellow-500/20 text-yellow-400' :
                                            'bg-red-500/10 border-red-500/20 text-red-400'}
                                `}>
                                    <div className={`w-1.5 h-1.5 rounded-full ${app.status === 'online' ? 'bg-green-500 animate-pulse' :
                                            app.status === 'maintenance' ? 'bg-yellow-500' :
                                                'bg-red-500'
                                        }`} />
                                    {app.status}
                                </div>
                            </div>

                            <div>
                                <div className="flex items-center gap-2 mb-2">
                                    <Typography variant="h5" className="font-bold text-white group-hover:text-indigo-300 transition-colors" {...commonProps}>
                                        {app.title}
                                    </Typography>
                                    {app.externalUrl && <ExternalLink size={14} className="text-white/40 group-hover:text-white transition-colors" />}
                                </div>
                                <Typography className="text-sm text-white/60 font-medium leading-relaxed" {...commonProps}>
                                    {app.description}
                                </Typography>
                            </div>
                        </GlassCard>
                    </motion.div>
                ))}
            </motion.div>
        </div>
    );
};

export default WebAppPage;
