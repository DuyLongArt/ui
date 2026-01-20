import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { getEnv } from '../../OrchestraLayer/Utilities/envUtils';

// --- TrueNAS Types ---
export interface PoolProps {
    id: number;
    name: string;
    status: string;
    size: number;
    allocated: number;
    free: number;
    healthy: boolean;
}

// --- Tailscale Types ---
export interface TailscaleDevice {
    addresses: string[];
    id: string;
    nodeId: string;
    user: string;
    name: string;
    hostname: string;
    clientVersion: string;
    updateAvailable: boolean;
    os: string;
    created: string;
    connectedToControl: boolean;
    lastSeen: string;
    expires: string;
    keyExpiryDisabled: boolean;
    authorized: boolean;
    isExternal: boolean;
    machineKey: string;
    nodeKey: string;
    tailnetLockKey: string;
    blocksIncomingConnections: boolean;
    tailnetLockError: string;
}

export interface TailscaleDeviceResponse {
    devices: TailscaleDevice[];
}

// --- Fetchers ---

const fetchTruenasPools = async () => {
    const apiKey = getEnv('VITE_TRUENAS_BEAR');
    // Note: The store used /api/v2.0/pool directly, assuming proxy setup in vite config
    // We will keep the same relative path
    const { data } = await axios.get<PoolProps[]>("/api/v2.0/pool", {
        headers: {
            Authorization: `Bearer ${apiKey}`,
        }
    });
    return data;
};

const fetchTailscaleDevices = async () => {
    const apiKey = getEnv('VITE_TAILSCALE_USERNAME');
    // Note: The store used /tailscale-api/tailnet/-/devices
    const { data } = await axios.get<TailscaleDeviceResponse>("/tailscale-api/tailnet/-/devices", {
        auth: {
            username: apiKey,
            password: ""
        }
    });
    return data.devices;
};

// --- Hooks ---

export const useTruenasPoolsQuery = () => {
    return useQuery({
        queryKey: ['truenas', 'pools'],
        queryFn: fetchTruenasPools,
        // Refetch every 30 seconds for storage stats
        refetchInterval: 30000,
        staleTime: 1000 * 30,
    });
};

export const useTailscaleDevicesQuery = () => {
    return useQuery({
        queryKey: ['tailscale', 'devices'],
        queryFn: fetchTailscaleDevices,
        // Refetch every minute for device status
        refetchInterval: 60000,
        staleTime: 1000 * 60,
    });
};
