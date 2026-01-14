import React from 'react';
import { useUserProfileStore } from '../../../../OrchestraLayer/StateManager/Zustand/userProfileStore';
import { useSelector } from '@xstate/react';
import { ChangeIOTSessionActor } from '../../../../OrchestraLayer/StateManager/XState/ChangeIOTSession';
import { IOTMapIcon } from './IOTMap';
import {
    HomeIcon,
    LightBulbIcon,
    LockClosedIcon,
    CpuChipIcon,
    FireIcon,
    ArrowRightOnRectangleIcon,
    GlobeAltIcon
} from "@heroicons/react/24/solid";
import HomeAssistant from './HomeAssistant';

const IOTPage = () => {
    const user = useUserProfileStore((state) => state.information);

    // --- CORE LOGIC (UNCHANGED) ---
    const changeSession = ChangeIOTSessionActor.useActorRef();
    const room = useSelector(changeSession, (snapshot) => snapshot.value);
    // ------------------------------

    return (
        <div className="flex w-full min-h-screen bg-slate-50 font-sans">

            {/* 1. Improved Sidebar */}
            <aside className='w-3 lg:w-64 bg-slate-900 text-white shadow-xl flex flex-col transition-all duration-300 z-10'>
                <div className="p-2 flex flex-col items-center border-b border-slate-800">
                    <div className="bg-blue-600 p-2 rounded-xl shadow-lg shadow-blue-900/40 mb-3 text-white">
                        <IOTMapIcon />
                    </div>
                    <div className="hidden w-fit lg:block tracking-wider uppercase text-white text-xs font-bold">
                        Smart Home
                    </div>
                </div>

                <div className="flex-1 flex flex-col gap-2 p-4">
                    <p className="hidden lg:block text-white font-bold uppercase ml-3 mb-2 text-[11px]">
                        Zones
                    </p>

                    <NavButton
                        title="My Room"
                        active={room === "onMyRoom"}
                        icon={<HomeIcon className="h-5 w-5" />}
                        onClick={() => changeSession.send({ type: "ROUTE", target: "onMyRoom" })}
                    />
                    <NavButton
                        title="Sub Room"
                        active={room === "onSubRoom"}
                        icon={<ArrowRightOnRectangleIcon className="h-5 w-5" />}
                        onClick={() => changeSession.send({ type: "ROUTE", target: "onSubRoom" })}
                    />
                    <NavButton
                        title="Network"
                        active={room === "onNetwork"}
                        icon={<GlobeAltIcon className="h-5 w-5" />}
                        onClick={() => changeSession.send({ type: "ROUTE", target: "onNetwork" })}
                    />
                </div>
            </aside>

            {/* 2. Main Content Area */}
            <main className='flex-1 p-6 lg:p-10 overflow-y-auto'>
                <header className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h2 className="text-3xl font-bold tracking-tight text-white">
                            Dashboard
                        </h2>
                        <p className="text-white font-medium mt-1">
                            Overview of your connected devices
                        </p>
                    </div>
                    <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm border border-slate-100">
                        <div className="relative flex h-3 w-3">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                        </div>
                        <span className="text-sm font-bold text-white">System Online</span>
                    </div>
                </header>

                <div className="">
                    {room === "onMyRoom" && <MyRoom />}
                    {room === "onSubRoom" && <SubRoom />}
                    {room === "onNetwork" && <HomeAssistant />}
                </div>
            </main>
        </div>
    );
};

// --- Sub Components ---

function NavButton({ title, active, onClick, icon }: any) {
    return (
        <button
            onClick={onClick}
            className={`flex items-center justify-center lg:justify-start gap-4 p-3 rounded-xl transition-all duration-200 group relative overflow-hidden w-full
            ${active
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/30'
                    : 'text-white hover:bg-slate-800 hover:text-white'
                }`}
        >
            <span className="z-10">{icon}</span>
            <span className="hidden lg:block font-medium z-10">{title}</span>
        </button>
    );
}

function MyRoom() {
    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <h4 className="text-xl font-bold text-white">
                    My Room
                </h4>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                <DeviceCard name="Living Room Light" status="On" type="light" />
                <DeviceCard name="Kitchen Thermostat" status="24°C" type="temp" />
                <DeviceCard name="Front Door" status="Locked" type="security" />
                <DeviceCard name="System Status" status="Nominal" type="system" />
            </div>
        </div>
    );
}

function SubRoom() {
    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <h4 className="text-xl font-bold text-white">
                    Sub Room
                </h4>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                <DeviceCard name="Sub Room Light" status="Off" type="light" />
                <DeviceCard name="Sub Room Thermostat" status="22°C" type="temp" />
                <DeviceCard name="Sub Room Door" status="Unlocked" type="security" />
                <DeviceCard name="Sub Room Status" status="Nominal" type="system" />
            </div>
        </div>
    );
}

function DeviceCard({ name, status, type }: { name: string, status: string, type?: string }) {
    const isActive = status === 'On' || status === 'Locked' || status.includes('°C') || status === 'Nominal';
    let Icon = CpuChipIcon;
    let colorClass = "text-blue-500 bg-blue-50";

    if (type === 'light') { Icon = LightBulbIcon; colorClass = isActive ? "text-amber-500 bg-amber-50" : "text-white bg-slate-100"; }
    if (type === 'temp') { Icon = FireIcon; colorClass = "text-orange-500 bg-orange-50"; }
    if (type === 'security') { Icon = LockClosedIcon; colorClass = status === 'Locked' ? "text-green-500 bg-green-50" : "text-red-500 bg-red-50"; }

    return (
        <div className="bg-white rounded-xl hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-slate-100 overflow-hidden shadow-sm">
            <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                    <div className={`p-3 rounded-2xl ${colorClass}`}>
                        <Icon className="h-6 w-6" />
                    </div>
                    <span
                        className={`px-2 py-1 text-xs font-bold uppercase rounded-full ${isActive ? "bg-green-100 text-green-700" : "bg-slate-100 text-white"}`}
                    >
                        {status}
                    </span>
                </div>

                <h6 className="text-lg font-bold text-white mb-1">
                    {name}
                </h6>
                <p className="text-sm text-white font-medium mb-6">
                    {type ? type.charAt(0).toUpperCase() + type.slice(1) : 'Device'}
                </p>

                <div className="flex gap-2 pt-4 border-t border-slate-100">
                    <button
                        className={`flex-1 px-4 py-2 rounded-lg text-sm font-bold shadow-sm hover:shadow-md transition-all ${isActive
                            ? "bg-linear-to-tr from-blue-600 to-blue-400 text-white"
                            : "border border-slate-300 text-white hover:bg-slate-50"
                            }`}
                    >
                        {isActive ? 'Active' : 'Enable'}
                    </button>
                    <button className="p-2 text-white hover:bg-slate-100 rounded-lg transition-colors">
                        <span className="text-xl">⚙</span>
                    </button>
                </div>
            </div>
        </div>
    );
}

export default IOTPage;