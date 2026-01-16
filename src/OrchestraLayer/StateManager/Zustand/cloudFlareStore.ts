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
    fetchDnsData: () => Promise<void>;
}

export const useCloudflareStore = create<CloudflareStore>((set) => ({
    dnsData: [],
    isLoading: false,
    error: null,
    setDnsData: (data: DNSGroup[]) => set({ dnsData: data }),
    fetchDnsData: async () => {
        set({ isLoading: true, error: null });
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

            const response = await axios.post("/cloudflare-graphql",
                { query },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${apiKey}`
                    }
                }
            );

            const data = response.data?.data?.viewer?.zones?.[0]?.dnsAnalyticsAdaptiveGroups;
            if (data) {
                set({ dnsData: data, isLoading: false });
            } else {
                set({ isLoading: false });
            }
        } catch (error: any) {
            console.error("❌ Failed to fetch Cloudflare DNS data:", error);
            set({
                error: error.response?.data?.errors?.[0]?.message || error.message || "Failed to fetch DNS data",
                isLoading: false
            });
        }
    }
}));