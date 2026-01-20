import axios from "axios";
// import { error } from "console";
import { create } from "zustand";
import { getEnv } from "../../Utilities/envUtils";

export interface DNSGroup {
    count: number;
    dimensions: {
        date: string;
        queryName: string;
        queryType: string;
    };
}

interface CloudflareStore {
    dnsData: DNSGroup[];
    isLoading: boolean;
    error: string | null;
    setDnsData: (data: DNSGroup[]) => void;
    // fetchDnsData: () => Promise<void>;
}

export const useCloudflareStore = create<CloudflareStore>((set) => ({
    dnsData: [],
    isLoading: false,
    error: null,
    setDnsData: (data: DNSGroup[]) => set({ dnsData: data }),
    
}));