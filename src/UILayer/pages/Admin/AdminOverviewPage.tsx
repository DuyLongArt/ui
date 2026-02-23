import React, { useState } from 'react';
import UtilitiesDashboardPage from "../Home/Utilities/UtilitiesDashboardPage";
import TailscaleDashboard from "../Home/Utilities/TailscaleDashboard";
import CloudflareDnsDashboard from "../Home/Utilities/CloudflareDnsDashboard";
import StoragePage from "../Home/Utilities/StoragePage";
import MusicPage from "../Home/Music/MusicPage";
import WebAppPage from "../Home/Utilities/WebAppPage";
import {
    LayoutDashboard,
    LayoutGrid,
    Cloud,
    Network,
    HardDrive,
    Music
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const AdminOverviewPage: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'Overview' | 'Apps' | 'Cloudflare' | 'Tailscale' | 'Storage' | 'Music'>('Overview');

    const tabs = [
        { id: 'Overview', label: 'Overview', icon: LayoutDashboard, color: 'text-blue-400' },
        { id: 'Apps', label: 'Applications', icon: LayoutGrid, color: 'text-green-400' },
        { id: 'Cloudflare', label: 'Cloudflare DNS', icon: Cloud, color: 'text-orange-400' },
        { id: 'Tailscale', label: 'Tailscale Mesh', icon: Network, color: 'text-indigo-400' },
        { id: 'Storage', label: 'Storage', icon: HardDrive, color: 'text-purple-400' },
        { id: 'Music', label: 'Music', icon: Music, color: 'text-pink-400' },
    ];

    // Determine background based on active tab
    // Storage and Music have their own backgrounds (min-h-screen), so we use a neutral/transparent background for their container.
    // The other dashboards expect a dark background (text-white).
    const getContainerClass = () => {
        switch (activeTab) {
            case 'Storage':
            case 'Music':
                return "min-h-screen";
            default:
                return "min-h-screen bg-slate-900 p-8";
        }
    };

    return (
        <div className={getContainerClass()}>
            {/* Tab Navigation */}
            <div className={`flex flex-wrap items-center gap-2 mb-8 ${['Storage', 'Music'].includes(activeTab) ? 'p-4 bg-slate-900/90 backdrop-blur-md sticky top-0 z-50 border-b border-white/10' : ''}`}>
                {tabs.map((tab) => {
                    const Icon = tab.icon;
                    const isActive = activeTab === tab.id;
                    return (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as any)}
                            className={`
                                relative flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold transition-all duration-300
                                ${isActive ? 'bg-white/10 text-white shadow-lg shadow-white/5' : 'text-slate-400 hover:text-white hover:bg-white/5'}
                            `}
                        >
                            <Icon size={16} className={isActive ? tab.color : 'text-current'} />
                            <span>{tab.label}</span>
                            {isActive && (
                                <motion.div
                                    layoutId="activeTab"
                                    className="absolute inset-0 rounded-full border border-white/10"
                                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                />
                            )}
                        </button>
                    );
                })}
            </div>

            {/* Dashboard Content */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                    className="w-full"
                >
                    {activeTab === 'Overview' && <UtilitiesDashboardPage />}
                    {activeTab === 'Apps' && <WebAppPage />}
                    {activeTab === 'Cloudflare' && <CloudflareDnsDashboard />}
                    {activeTab === 'Tailscale' && <TailscaleDashboard />}
                    {/* StoragePage and MusicPage handle their own layout padding/margins mostly, but we wrapper ensures clean transition */}
                    {activeTab === 'Storage' && <StoragePage />}
                    {activeTab === 'Music' && <MusicPage />}
                </motion.div>
            </AnimatePresence>
        </div>
    );
};

export default AdminOverviewPage;