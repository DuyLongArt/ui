import React from "react";
import { useNavigate } from "react-router-dom";
import { MapIcon } from "@heroicons/react/24/solid";
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';

// 1. CRITICAL: Uncomment this or the map will look broken (tiles stacking)
import 'leaflet/dist/leaflet.css';

// 2. FIX: Import marker images so they aren't invisible
// import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
// import markerIcon from 'leaflet/dist/images/marker-icon.png';
// import markerShadow from 'leaflet/dist/images/marker-shadow.png';

// 3. APPLY FIX: Reset the default icon state
// Leaflet's default icon path detection fails in React bundlers (Vite/Webpack)
/*
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
    iconUrl: markerIcon,
    iconRetinaUrl: markerIcon2x,
    shadowUrl: markerShadow,
});
*/

// --- Component 1: The Button ---
const IOTMapIcon = () => {
    const navigator = useNavigate();
    return (
        <div className="flex justify-center items-center">
            <button
                onClick={() => navigator('/iot/map')}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors shadow-md"
            >
                <MapIcon className="h-5 w-5" />
                <span>Open Map</span>
            </button>
        </div>
    );
}

// --- Component 2: The Map ---
const IOTMap: React.FC = () => {
    const vietnamCenter: [number, number] = [21.0285, 105.8542]; // Hanoi
    const hcmc: [number, number] = [10.8231, 106.6297]; // HCMC

    return (
        <div className="w-full h-full flex flex-col bg-gray-100">
            <div className="p-4 bg-white shadow-sm z-10 border-b border-gray-200">
                <h2 className="text-xl font-bold text-white">IOT Device Map (Vietnam)</h2>
            </div>

            <div className="flex-1 relative z-0">
                <MapContainer
                    // Fixes "Leaflet Events" crash in React 18 Strict Mode
                    key={new Date().getTime()}
                    center={vietnamCenter}
                    zoom={6}
                    scrollWheelZoom={true}
                    style={{ height: "100%", width: "100%" }}
                >
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />

                    <Marker position={vietnamCenter}>
                        <Popup>
                            <strong>Device #01</strong><br />
                            Location: Hanoi<br />
                            Status: <span className="text-green-600 font-bold">Online</span>
                        </Popup>
                    </Marker>

                    <Marker position={hcmc}>
                        <Popup>
                            <strong>Device #02</strong><br />
                            Location: HCMC<br />
                            Status: <span className="text-red-600 font-bold">Offline</span>
                        </Popup>
                    </Marker>
                </MapContainer>
            </div>
        </div>
    );
};

export { IOTMap, IOTMapIcon };