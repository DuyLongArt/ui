import { Typography } from "@material-tailwind/react";
import { GlassCard } from '../Person/GlassContainer';
import { useUserProfileStore } from '../../../../OrchestraLayer/StateManager/Zustand/userProfileStore';
import { CassettePlayer } from "../../../components/NostagiaComponent/CassettePlayer";
import { VinylRecord } from "../../../components/NostagiaComponent/VinylRecord";
import { Activity, Users, Eye, Music, TrendingUp } from 'lucide-react';

const DashboardPage = () => {
    const userStore = useUserProfileStore();
    const userFirstName = userStore.information.profiles.firstName || "Guest";

    const stats = [
        { label: "Profile Views", value: "2.4k", icon: <Eye size={20} />, color: "bg-blue-500", trend: "+12%" },
        { label: "Projects", value: "42", icon: <Activity size={20} />, color: "bg-purple-500", trend: "+5%" },
        { label: "Followers", value: "847", icon: <Users size={20} />, color: "bg-pink-500", trend: "+18%" },
        { label: "Engagement", value: "95%", icon: <TrendingUp size={20} />, color: "bg-green-500", trend: "+2%" },
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
        <div className="min-h-screen w-full p-4 md:p-8 space-y-8 bg-amber-50 animate-fade-in-up pb-24">

            {/* Header Greeting */}
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <Typography variant="h2" className="text-slate-800 font-bold tracking-tight" {...commonProps}>
                        Welcome back, {userFirstName}! 👋
                    </Typography>
                    <Typography className="text-slate-500 font-medium" {...commonProps}>
                        Here's what's happening with your profile today.
                    </Typography>
                </div>
                <div className="flex gap-2">
                    <span className="px-4 py-2 bg-white/50 backdrop-blur-md rounded-full text-sm font-semibold text-slate-600 border border-white/60 shadow-sm">
                        {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                    </span>
                </div>
            </header>

            {/* Stats Grid */}


            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Activity / Main Section */}
                <div className="lg:col-span-2 space-y-8">
                    <GlassCard className="p-8 min-h-[400px]">
                        <div className="flex justify-between items-center mb-8">
                            <Typography variant="h5" className="text-slate-800 font-bold" {...commonProps}>Activity Overview</Typography>
                            <select className="bg-white/50 border-none text-slate-600 text-sm rounded-lg cursor-pointer outline-none focus:ring-0">
                                <option>Last 7 Days</option>
                                <option>Last Month</option>
                            </select>
                        </div>

                        {/* Mock Chart Area */}
                        <div className="h-64 flex items-end justify-between gap-2 px-4">
                            {[40, 70, 45, 90, 60, 80, 50, 65, 85, 45, 95, 75].map((h, i) => (
                                <div key={i} className="w-full bg-blue-100/50 rounded-t-lg relative group h-full flex items-end">
                                    <div
                                        className="w-full bg-linear-to-t from-blue-500 to-blue-400 rounded-t-lg transition-all duration-1000 group-hover:bg-blue-600"
                                        style={{ height: `${h}%` }}
                                    ></div>
                                    <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                                        {h}%
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="flex justify-between mt-4 text-xs text-slate-400 font-medium px-2">
                            <span>Jan</span><span>Feb</span><span>Mar</span><span>Apr</span><span>May</span><span>Jun</span>
                            <span>Jul</span><span>Aug</span><span>Sep</span><span>Oct</span><span>Nov</span><span>Dec</span>
                        </div>
                    </GlassCard>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <GlassCard className="p-6">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-2 bg-orange-100 text-orange-600 rounded-lg">
                                    <Music size={20} />
                                </div>
                                <Typography variant="h6" className="text-slate-800 font-bold" {...commonProps}>Now Playing</Typography>
                            </div>
                            <div className="flex justify-center py-4 scale-90 origin-top">
                                <CassettePlayer />
                            </div>
                        </GlassCard>

                        <GlassCard className="p-6 flex flex-col items-center justify-center relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-6 opacity-10">
                                <Music size={100} />
                            </div>
                            <Typography variant="h6" className="text-slate-800 font-bold mb-6 self-start z-10" {...commonProps}>Vinyl Collection</Typography>
                            <div className="scale-75 z-10">
                                <VinylRecord />
                            </div>
                        </GlassCard>
                    </div>
                </div>

                {/* Sidebar / Recent Activity */}
                <div className="space-y-8">
                    <GlassCard className="p-6 h-full">
                        <Typography variant="h6" className="text-slate-800 font-bold mb-6" {...commonProps}>Recent Activity</Typography>
                        <div className="space-y-6">
                            {[
                                { action: "Updated profile picture", time: "2 mins ago", color: "bg-blue-500" },
                                { action: "Completed 'E-commerce App'", time: "4 hours ago", color: "bg-green-500" },
                                { action: "Added new skill: 'React Native'", time: "Yesterday", color: "bg-purple-500" },
                                { action: "Reached 1k followers", time: "2 days ago", color: "bg-pink-500" },
                            ].map((item, i) => (
                                <div key={i} className="flex gap-4 relative">
                                    {i !== 3 && <div className="absolute left-[9px] top-8 bottom-[-24px] w-0.5 bg-slate-200"></div>}
                                    <div className={`w-5 h-5 rounded-full ${item.color} shrink-0 mt-1 ring-4 ring-white`}></div>
                                    <div>
                                        <Typography className="text-slate-700 text-sm font-semibold" {...commonProps}>{item.action}</Typography>
                                        <Typography className="text-slate-400 text-xs" {...commonProps}>{item.time}</Typography>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="mt-8 pt-6 border-t border-slate-100">
                            <Typography variant="h6" className="text-slate-800 font-bold mb-4" {...commonProps}>Quick Actions</Typography>
                            <div className="space-y-3">
                                <button className="w-full py-2.5 px-4 bg-slate-50 hover:bg-white hover:shadow-md text-slate-600 rounded-xl text-sm font-semibold text-left transition-all border border-slate-200 flex items-center justify-between group">
                                    Edit Profile
                                    <span className="text-slate-400 group-hover:text-blue-500">→</span>
                                </button>
                                <button className="w-full py-2.5 px-4 bg-slate-50 hover:bg-white hover:shadow-md text-slate-600 rounded-xl text-sm font-semibold text-left transition-all border border-slate-200 flex items-center justify-between group">
                                    Upload Resume
                                    <span className="text-slate-400 group-hover:text-blue-500">→</span>
                                </button>
                            </div>
                        </div>
                    </GlassCard>
                </div>
            </div>

        </div>
    );
};

export default DashboardPage;
