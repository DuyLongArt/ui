import { getEnv } from "@/OrchestraLayer/Utilities/envUtils";
import axios from "axios";
import { create } from "zustand";

interface PoolProps {
    id:number;
    name: string;
    status: string;
    size: number;
    allocated: number;
    free: number;
    healthy:boolean;
}
interface TruenasStorageStore {
    pools: PoolProps[];
    percentageUsed: number[];
    getPools: () => void;
    setPercentage: () => void;
}
const apiKey = getEnv('VITE_TRUENAS_BEAR');
const useTruenasStorageStore = create<TruenasStorageStore>((set, get) => ({
    pools: [{
        id:0,
        name: "",
        status: "",
        size: 0,
        allocated: 0,
        free: 0,
        healthy:false
    }],
    percentageUsed: [],
    getPools: async () => {
    await axios.get<PoolProps[]>("/api/v2.0/pool", {
        headers: {
                Authorization: `Bearer ${apiKey}`,
               
            }
        }).then((res) => {
            console.log("+====================")
            console.log(res.data)
            set({ pools: res.data })
        })
    },

    setPercentage: async () => {
        var percentage: number[] = [];
        get().pools.forEach(pool => {
            percentage.push((pool.allocated) / pool.size);
        });
        set({ percentageUsed: percentage })
    }

}));
export { useTruenasStorageStore }