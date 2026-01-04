import { GlobeAltIcon, LightBulbIcon } from "@heroicons/react/24/solid";
import React, { useState } from "react";

const HomeAssistant: React.FC = () => {
    const [isOn, setIsOn] = useState(false);
    const [loading, setLoading] = useState(false);

    const toggleMainDevice = async () => {
        setLoading(true);
        const action = isOn ? 'turn_off' : 'turn_on';
        try {
            await fetch(`http://duylongnetwork.local/switch/main_device_switch/${action}`, {
                method: 'POST',
            });
            setIsOn(!isOn);
        } catch (error) {
            console.error("Failed to toggle device:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col h-full animate-fade-in-up">
            <div className="flex items-center justify-between mb-6">
                <div className="flex flex-col">
                    <p className="font-bold text-black text-lg">
                        Network Dashboard
                    </p>
                    <p className="text-gray-500 font-normal text-sm">
                        Monitoring local network activity
                    </p>
                </div>
                <div className="flex gap-2">
                    <span className="px-3 py-1 bg-green-50 text-green-600 rounded-full text-xs font-bold uppercase tracking-wide">Online</span>
                    <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-bold uppercase tracking-wide">Local</span>
                </div>
            </div>

            {/* Controls Section */}
            <div className="mb-6 bg-white p-4 rounded-xl border border-slate-200 flex items-center justify-between shadow-sm">
                <div className="flex items-center gap-3">
                    <div className={`p-3 rounded-lg ${isOn ? 'bg-amber-100 text-amber-600' : 'bg-slate-100 text-slate-500'}`}>
                        <LightBulbIcon className="h-6 w-6" />
                    </div>
                    <div>
                        <h6 className="font-bold text-slate-800 text-base">
                            Main Device
                        </h6>
                        <p className="text-slate-500 text-sm">
                            ESP32 Controller
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <span className={`font-bold text-sm ${isOn ? 'text-green-500' : 'text-slate-400'}`}>
                        {isOn ? 'ON' : 'OFF'}
                    </span>

                    {/* Custom Switch Implementation */}
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input
                            type="checkbox"
                            className="sr-only peer"
                            checked={isOn}
                            onChange={toggleMainDevice}
                            disabled={loading}
                        />
                        <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                </div>
            </div>

            <div className="flex-1 bg-white rounded-xl border border-slate-200 overflow-hidden relative min-h-[800px] shadow-sm">
                <div className="absolute inset-0 flex items-center justify-center bg-slate-50 -z-10">
                    <div className="flex flex-col items-center gap-2">
                        <GlobeAltIcon className="h-16 w-16 text-slate-300 animate-pulse" />
                        <p className="text-slate-400 font-medium text-sm">Loading Network Interface...</p>
                    </div>
                </div>
                <iframe
                    src="http://duylongnetwork.local/"
                    className="w-full h-full border-0"
                    title="Network Dashboard"
                    allowFullScreen
                />
            </div>
        </div>
    );
}

export default HomeAssistant;