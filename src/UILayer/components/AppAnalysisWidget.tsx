import React, { useState, useEffect } from 'react';
import { GlassCard } from '../pages/Home/Person/GlassContainer';
import { Typography } from "@material-tailwind/react";
import {
    Activity,
    Cpu,
    Zap,
    Clock,
    Globe,
    Users,
    Shield
} from 'lucide-react';


const AppAnalysisWidget: React.FC = () => {
    const [stats, setStats] = useState({
        fps: 60,
        memory: 0,
        time: new Date().toLocaleTimeString(),
        uptime: '0h 0m'
    });
    const startTime = React.useRef(Date.now());

    useEffect(() => {
        let frameCount = 0;
        let lastTime = performance.now();

        const updateStats = () => {
            const now = performance.now();
            frameCount++;

            if (now - lastTime >= 1000) {
                const fps = Math.round((frameCount * 1000) / (now - lastTime));

                // Calculate uptime
                const uptimeMillis = Date.now() - startTime.current;
                const hours = Math.floor(uptimeMillis / 3600000);
                const minutes = Math.floor((uptimeMillis % 3600000) / 60000);

                // Memory (if available in Chrome/Edge)
                // @ts-ignore
                const newMemory = window.performance?.memory ? Math.round(window.performance.memory.usedJSHeapSize / 1048576) : 0;

                setStats({
                    fps,
                    memory: newMemory,
                    time: new Date().toLocaleTimeString(),
                    uptime: `${hours}h ${minutes}m`
                });

                frameCount = 0;
                lastTime = now;
            }
            requestAnimationFrame(updateStats);
        };

        const animationId = requestAnimationFrame(updateStats);
        return () => cancelAnimationFrame(animationId);
    }, []);

    const commonProps = {
        placeholder: undefined,
        onPointerEnterCapture: undefined,
        onPointerLeaveCapture: undefined,
        onResize: undefined,
        onResizeCapture: undefined,
    } as any;

    const metrics = [
        { label: "FPS", value: stats.fps, icon: <Activity size={14} />, color: stats.fps > 50 ? "text-green-400" : "text-yellow-400" },
        { label: "Memory", value: `${stats.memory} MB`, icon: <Cpu size={14} />, color: "text-blue-400" },
        { label: "Uptime", value: stats.uptime, icon: <Clock size={14} />, color: "text-purple-400" },
        { label: "Ping", value: "24ms", icon: <Zap size={14} />, color: "text-orange-400" },
    ];

    return (
        <div className="absolute top-full right-0 mt-2 w-80 z-50 px-2 lg:px-0">
            <GlassCard className="p-4 bg-indigo-900/90 backdrop-blur-xl border border-white/20 shadow-2xl">
                <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/10">
                    <div className="flex items-center gap-2">
                        <div className="p-1.5 bg-indigo-500/20 rounded-lg text-indigo-300">
                            <Shield size={16} />
                        </div>
                        <div>
                            <Typography className="text-sm font-bold text-white leading-none" {...commonProps}>System Status</Typography>
                            <span className="text-[10px] text-white/50">Live Monitor</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                        <span className="text-[10px] font-bold text-green-400 uppercase">Operational</span>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-4">
                    {metrics.map((metric, i) => (
                        <div key={i} className="p-2.5 bg-white/5 rounded-xl border border-white/5 hover:bg-white/10 transition-colors">
                            <div className="flex items-center gap-2 mb-1 text-white/60">
                                {metric.icon}
                                <span className="text-[10px] font-bold uppercase tracking-wider">{metric.label}</span>
                            </div>
                            <div className={`text-lg font-bold font-mono ${metric.color}`}>
                                {metric.value}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="space-y-2">
                    <Typography className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-2" {...commonProps}>Active Modules</Typography>

                    {[
                        { name: "Global State", status: "Active", icon: <Globe size={12} /> },
                        { name: "Auth Layer", status: "Secure", icon: <Users size={12} /> },
                    ].map((module, i) => (
                        <div key={i} className="flex items-center justify-between py-1.5 px-2 rounded-lg hover:bg-white/5 transition-colors">
                            <div className="flex items-center gap-2 text-white/80 text-xs font-medium">
                                {module.icon}
                                {module.name}
                            </div>
                            <span className="text-[10px] font-bold text-green-400">{module.status}</span>
                        </div>
                    ))}
                </div>

                <div className="mt-4 pt-3 border-t border-white/10 flex justify-between items-center text-[10px] text-white/40">
                    <span>v2.4.0-stable</span>
                    <span>{stats.time}</span>
                </div>
            </GlassCard>
        </div>
    );
};

export default AppAnalysisWidget;
