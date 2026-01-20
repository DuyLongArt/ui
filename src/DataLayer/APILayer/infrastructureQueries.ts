import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { getEnv } from '../../OrchestraLayer/Utilities/envUtils';
import type { DNSGroup } from '@/OrchestraLayer/StateManager/Zustand/cloudFlareStore';

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
const fetchDnsData = async () => {
    try {
        const today = new Date();
        const dateLeq = today.toISOString().split('T')[0];
        // Subtract 6 days to get exactly 7 days of data including today (e.g., 10th to 16th)
        const dateGeq = new Date(today.getTime() - (6 * 24 * 60 * 60 * 1000)).toISOString().split('T')[0];

        const query = `{
                viewer {
                    zones(filter: { zoneTag: "e37d2be8f168aa87d1e04b0f1e39f583" }) {
                        dnsAnalyticsAdaptiveGroups(
                            limit: 1000
                            filter: { 
                            date_geq: "${dateGeq}", 
                                date_leq: "${dateLeq}" 
                            }
                            orderBy: [date_ASC]
                        ) {
                            count
                            dimensions {
                                date
                                queryName
                                queryType
                            }
                        }
                    }
                }
            }`;

        const apiKey = getEnv('VITE_CLOUDFLARE_API_BEAR');

        const response = await axios.post("/cloudflare-graphql/",
            { query },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKey}`
                }
            }
        );
        const data = response.data?.data?.viewer?.zones?.[0]?.dnsAnalyticsAdaptiveGroups;

        return (data as DNSGroup[]) || [];

    } catch (error) {
        console.error("❌ Cloudflare Fetch Error:", error);
        throw error;
    }
}
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
export const useCloudflareDnsDataQuery = () => {
    return useQuery({
        queryKey: ['cloudflare', 'dns-data'],
        queryFn: fetchDnsData,
        refetchInterval: 60000,
        staleTime: 1000 * 60,
    })
}