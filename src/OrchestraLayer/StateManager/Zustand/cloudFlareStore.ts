import axios from "axios";
import { create } from "zustand";

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
    setDnsData: (data: DNSGroup[]) => void;
    fetchDnsData: () => void;
}

export const useCloudflareStore = create<CloudflareStore>((set) => ({
    dnsData: [
        { "count": 10, "dimensions": { "date": "2026-01-06", "queryName": "log.duylong.art", "queryType": "A" } },
        { "count": 10, "dimensions": { "date": "2026-01-06", "queryName": "activate.duylong.art", "queryType": "A" } },
        { "count": 10, "dimensions": { "date": "2026-01-06", "queryName": "mail.duylong.art", "queryType": "AAAA" } },
        { "count": 10, "dimensions": { "date": "2026-01-06", "queryName": "mx2.duylong.art", "queryType": "A" } },
        { "count": 10, "dimensions": { "date": "2026-01-06", "queryName": "_dmarc.duylong.art", "queryType": "A" } },
        { "count": 20, "dimensions": { "date": "2026-01-06", "queryName": "duylong.art", "queryType": "MX" } },
        { "count": 10, "dimensions": { "date": "2026-01-06", "queryName": "duylong.art", "queryType": "SOA" } },
        { "count": 10, "dimensions": { "date": "2026-01-06", "queryName": "hostmaster.duylong.art", "queryType": "A" } },
        { "count": 60, "dimensions": { "date": "2026-01-06", "queryName": "duylong.art", "queryType": "AAAA" } },
        { "count": 10, "dimensions": { "date": "2026-01-06", "queryName": "magento.duylong.art", "queryType": "A" } },
        { "count": 10, "dimensions": { "date": "2026-01-06", "queryName": "v2.duylong.art", "queryType": "AAAA" } },
        { "count": 110, "dimensions": { "date": "2026-01-06", "queryName": "duylong.art", "queryType": "A" } },
        { "count": 10, "dimensions": { "date": "2026-01-06", "queryName": "gworkspace.duylong.art", "queryType": "A" } },
        { "count": 10, "dimensions": { "date": "2026-01-06", "queryName": "wig.duylong.art", "queryType": "A" } },
        { "count": 10, "dimensions": { "date": "2026-01-06", "queryName": "microsoft.duylong.art.duylong.art", "queryType": "A" } },
        { "count": 20, "dimensions": { "date": "2026-01-06", "queryName": "gworkspace.duylong.art", "queryType": "MX" } },
        { "count": 70, "dimensions": { "date": "2026-01-06", "queryName": "duylong.art", "queryType": "DNSKEY" } },
        { "count": 10, "dimensions": { "date": "2026-01-06", "queryName": "www.duylong.art", "queryType": "AAAA" } },
        { "count": 10, "dimensions": { "date": "2026-01-06", "queryName": "status.duylong.art", "queryType": "A" } },
        { "count": 10, "dimensions": { "date": "2026-01-06", "queryName": "ns1.duylong.art", "queryType": "A" } },
        { "count": 10, "dimensions": { "date": "2026-01-06", "queryName": "help.duylong.art", "queryType": "A" } },
        { "count": 10, "dimensions": { "date": "2026-01-06", "queryName": "ww17.duylong.art", "queryType": "A" } },
        { "count": 40, "dimensions": { "date": "2026-01-06", "queryName": "duylong.art", "queryType": "NS" } },
        { "count": 10, "dimensions": { "date": "2026-01-06", "queryName": "booking.duylong.art", "queryType": "A" } },
        { "count": 10, "dimensions": { "date": "2026-01-06", "queryName": "duylong.art", "queryType": "CNAME" } },
        { "count": 10, "dimensions": { "date": "2026-01-06", "queryName": "m.duylong.art", "queryType": "A" } },
        { "count": 10, "dimensions": { "date": "2026-01-06", "queryName": "h5.duylong.art", "queryType": "A" } },
        { "count": 10, "dimensions": { "date": "2026-01-06", "queryName": "*.duylong.art", "queryType": "MX" } },
        { "count": 20, "dimensions": { "date": "2026-01-06", "queryName": "api.duylong.art", "queryType": "A" } },
        { "count": 10, "dimensions": { "date": "2026-01-06", "queryName": "en.duylong.art", "queryType": "A" } },
        { "count": 10, "dimensions": { "date": "2026-01-06", "queryName": "wss.duylong.art", "queryType": "A" } },
        { "count": 10, "dimensions": { "date": "2026-01-06", "queryName": "crm.duylong.art", "queryType": "A" } },
        { "count": 10, "dimensions": { "date": "2026-01-06", "queryName": "backend.duylong.art", "queryType": "AAAA" } },
        { "count": 30, "dimensions": { "date": "2026-01-06", "queryName": "mail.duylong.art", "queryType": "A" } },
        { "count": 10, "dimensions": { "date": "2026-01-07", "queryName": "duylong.art", "queryType": "SOA" } },
        { "count": 10, "dimensions": { "date": "2026-01-07", "queryName": "backend.duylong.art", "queryType": "AAAA" } },
        { "count": 20, "dimensions": { "date": "2026-01-07", "queryName": "duylong.art", "queryType": "NS" } },
        { "count": 10, "dimensions": { "date": "2026-01-07", "queryName": "duylong.art", "queryType": "CNAME" } },
        { "count": 10, "dimensions": { "date": "2026-01-07", "queryName": "www.duylong.art", "queryType": "AAAA" } },
        { "count": 10, "dimensions": { "date": "2026-01-07", "queryName": "duylong.art.duylong.art", "queryType": "A" } },
        { "count": 10, "dimensions": { "date": "2026-01-07", "queryName": "duylong.art", "queryType": "MX" } },
        { "count": 20, "dimensions": { "date": "2026-01-07", "queryName": "gworkspace.duylong.art", "queryType": "MX" } },
        { "count": 20, "dimensions": { "date": "2026-01-07", "queryName": "backend.duylong.art", "queryType": "A" } },
        { "count": 10, "dimensions": { "date": "2026-01-07", "queryName": "*.duylong.art", "queryType": "A" } },
        { "count": 10, "dimensions": { "date": "2026-01-07", "queryName": "microsoft.duylong.art.duylong.art", "queryType": "A" } },
        { "count": 10, "dimensions": { "date": "2026-01-07", "queryName": "mail.duylong.art", "queryType": "AAAA" } },
        { "count": 10, "dimensions": { "date": "2026-01-07", "queryName": "*.duylong.art", "queryType": "MX" } },
        { "count": 10, "dimensions": { "date": "2026-01-07", "queryName": "mail.duylong.art", "queryType": "A" } },
        { "count": 50, "dimensions": { "date": "2026-01-07", "queryName": "www.duylong.art", "queryType": "A" } },
        { "count": 40, "dimensions": { "date": "2026-01-07", "queryName": "duylong.art", "queryType": "DNSKEY" } },
        { "count": 10, "dimensions": { "date": "2026-01-07", "queryName": "duylong.art", "queryType": "TXT" } },
        { "count": 80, "dimensions": { "date": "2026-01-07", "queryName": "duylong.art", "queryType": "AAAA" } },
        { "count": 130, "dimensions": { "date": "2026-01-07", "queryName": "duylong.art", "queryType": "A" } },
        { "count": 30, "dimensions": { "date": "2026-01-08", "queryName": "duylong.art", "queryType": "SOA" } },
        { "count": 10, "dimensions": { "date": "2026-01-08", "queryName": "duylong.art", "queryType": "CAA" } },
        { "count": 30, "dimensions": { "date": "2026-01-08", "queryName": "backend.duylong.art", "queryType": "AAAA" } },
        { "count": 130, "dimensions": { "date": "2026-01-08", "queryName": "gworkspace.duylong.art", "queryType": "MX" } },
        { "count": 20, "dimensions": { "date": "2026-01-08", "queryName": "www.duylong.art", "queryType": "AAAA" } },
        { "count": 130, "dimensions": { "date": "2026-01-08", "queryName": "duylong.art", "queryType": "A" } },
        { "count": 30, "dimensions": { "date": "2026-01-08", "queryName": "duylong.art", "queryType": "MX" } },
        { "count": 10, "dimensions": { "date": "2026-01-08", "queryName": "backend.duylong.art", "queryType": "NS" } },
        { "count": 10, "dimensions": { "date": "2026-01-08", "queryName": "microsoft.duylong.art.duylong.art", "queryType": "A" } },
        { "count": 60, "dimensions": { "date": "2026-01-08", "queryName": "gworkspace.duylong.art", "queryType": "A" } },
        { "count": 20, "dimensions": { "date": "2026-01-08", "queryName": "www.duylong.art", "queryType": "A" } },
        { "count": 10, "dimensions": { "date": "2026-01-08", "queryName": "duylong.art", "queryType": "TXT" } },
        { "count": 30, "dimensions": { "date": "2026-01-08", "queryName": "duylong.art", "queryType": "DNSKEY" } },
        { "count": 30, "dimensions": { "date": "2026-01-08", "queryName": "duylong.art", "queryType": "NS" } },
        { "count": 10, "dimensions": { "date": "2026-01-08", "queryName": "duylong.art", "queryType": "CNAME" } },
        { "count": 20, "dimensions": { "date": "2026-01-08", "queryName": "duylong.art", "queryType": "AAAA" } },
        { "count": 20, "dimensions": { "date": "2026-01-09", "queryName": "mail.duylong.art", "queryType": "A" } },
        { "count": 10, "dimensions": { "date": "2026-01-09", "queryName": "duylong.art", "queryType": "MX" } },
        { "count": 30, "dimensions": { "date": "2026-01-09", "queryName": "backend.duylong.art", "queryType": "A" } },
        { "count": 20, "dimensions": { "date": "2026-01-09", "queryName": "gworkspace.duylong.art", "queryType": "MX" } },
        { "count": 10, "dimensions": { "date": "2026-01-09", "queryName": "duylong.art", "queryType": "SOA" } },
        { "count": 10, "dimensions": { "date": "2026-01-09", "queryName": "backendbackup.duylong.art", "queryType": "AAAA" } },
        { "count": 50, "dimensions": { "date": "2026-01-09", "queryName": "duylong.art", "queryType": "TXT" } },
        { "count": 20, "dimensions": { "date": "2026-01-09", "queryName": "www.duylong.art", "queryType": "A" } },
        { "count": 60, "dimensions": { "date": "2026-01-09", "queryName": "duylong.art", "queryType": "AAAA" } },
        { "count": 40, "dimensions": { "date": "2026-01-09", "queryName": "backend.duylong.art", "queryType": "AAAA" } },
        { "count": 20, "dimensions": { "date": "2026-01-09", "queryName": "duylong.art", "queryType": "ANY" } },
        { "count": 10, "dimensions": { "date": "2026-01-09", "queryName": "duylong.art", "queryType": "CNAME" } },
        { "count": 100, "dimensions": { "date": "2026-01-09", "queryName": "duylong.art", "queryType": "A" } },
        { "count": 10, "dimensions": { "date": "2026-01-09", "queryName": "_dmarc.duylong.art", "queryType": "A" } },
        { "count": 30, "dimensions": { "date": "2026-01-09", "queryName": "duylong.art", "queryType": "NS" } },
        { "count": 20, "dimensions": { "date": "2026-01-09", "queryName": "duylong.art", "queryType": "DNSKEY" } },
        { "count": 270, "dimensions": { "date": "2026-01-10", "queryName": "duylong.art", "queryType": "DNSKEY" } },
        { "count": 220, "dimensions": { "date": "2026-01-10", "queryName": "backend.duylong.art", "queryType": "A" } },
        { "count": 20, "dimensions": { "date": "2026-01-10", "queryName": "ftps.duylong.art", "queryType": "AAAA" } },
        { "count": 20, "dimensions": { "date": "2026-01-10", "queryName": "guft45rlkn8amuv8owiyx83ayecue9h3.duylong.art", "queryType": "AAAA" } },
        { "count": 10, "dimensions": { "date": "2026-01-10", "queryName": "*.duylong.art", "queryType": "MX" } },
        { "count": 10, "dimensions": { "date": "2026-01-10", "queryName": "www.nas.duylong.art", "queryType": "A" } },
        { "count": 20, "dimensions": { "date": "2026-01-10", "queryName": "mail.duylong.art", "queryType": "A" } },
        { "count": 10, "dimensions": { "date": "2026-01-10", "queryName": "login.duylong.art", "queryType": "A" } },
        { "count": 10, "dimensions": { "date": "2026-01-10", "queryName": "vpn2.duylong.art", "queryType": "AAAA" } },
        { "count": 10, "dimensions": { "date": "2026-01-10", "queryName": "www.truenas.duylong.art", "queryType": "A" } },
        { "count": 10, "dimensions": { "date": "2026-01-10", "queryName": "sslvpn2.duylong.art", "queryType": "AAAA" } },
        { "count": 10, "dimensions": { "date": "2026-01-10", "queryName": "duylong.art", "queryType": "CAA" } },
        { "count": 30, "dimensions": { "date": "2026-01-10", "queryName": "truenas.duylong.art", "queryType": "NS" } },
        { "count": 90, "dimensions": { "date": "2026-01-10", "queryName": "truenas.duylong.art", "queryType": "AAAA" } },
        { "count": 40, "dimensions": { "date": "2026-01-10", "queryName": "truenas.duylong.art", "queryType": "TXT" } }
    ],
    setDnsData: (dnsData) => set({ dnsData }),
    fetchDnsData: async () => {
        try {
            const today = new Date();
            const dateLeq = today.toISOString().split('T')[0];
            const dateGeq = new Date(new Date().setDate(today.getDate() - 7)).toISOString().split('T')[0];

            const query = `{
                viewer {
                    zones(filter: { zoneTag: "e37d2be8f168aa87d1e04b0f1e39f583" }) {
                        dnsAnalyticsAdaptiveGroups(
                            limit: 100
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

            const response = await axios.post("/cloudflare-graphql",
                { query },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + process.env.CLOUDFLARE_API_BEAR
                    }
                }
            );

            const data = response.data?.data?.viewer?.zones?.[0]?.dnsAnalyticsAdaptiveGroups;
            if (data) {
                set({ dnsData: data });
            }
        } catch (error) {
            console.error("❌ Failed to fetch Cloudflare DNS data:", error);
        }
    }
}));
