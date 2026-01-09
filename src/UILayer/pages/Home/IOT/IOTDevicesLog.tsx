import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import React from "react";

// 1. Move Interfaces to a clear structure
interface IOTLogRecord {
    id: number;
    name: string;
    description: string;
}

// 2. Improve Fetcher: Pass parameters to make it reusable
const fetchIOTDeviceRecords = async (idHeader: number): Promise<IOTLogRecord[]> => {
    const { data } = await axios.get<IOTLogRecord[]>('http://192.168.22.4:8686/backend_app/mock', {
        params: { idHeader }
    });
    return data;
};

const IOTDevicesLog: React.FC = () => {
    // 3. FIX: useQuery returns an object { data, isLoading, isError, error }
    const { data, isLoading, isError, error, refetch } = useQuery({
        queryKey: ['iot-device-records', 1], // Add the ID to the key so it recaches if ID changes
        queryFn: () => fetchIOTDeviceRecords(1),
        staleTime: 1000 * 60, // Consider data "fresh" for 1 minute
        retry: 3, // Automatically retry 3 times on failure
    });

    // 4. Handle Loading State
    if (isLoading) {
        return <div className="p-4 animate-pulse">Loading device logs...</div>;
    }

    // 5. Handle Error State
    if (isError) {
        return (
            <div className="p-4 text-red-500">
                Error: {error instanceof Error ? error.message : 'Failed to fetch logs'}
                <button onClick={() => refetch()} className="ml-2 underline">Retry</button>
            </div>
        );
    }

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">IOT Devices Log</h1>
            <ul className="space-y-2">
                {data?.map((item) => (
                    <li key={item.id} className="p-3 border rounded shadow-sm hover:bg-gray-50">
                        <span className="font-semibold">{item.name}</span>
                        <p className="text-sm text-gray-600">{item.description}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default IOTDevicesLog;