import axios from "axios";
import { create } from "zustand";

interface PoolProps {
    id: number;
    name: string;
    status: string;
    size: number;
    allocated: number;
    free: number;
    healthy: boolean;
}
interface TruenasStorageStore {
    pools: PoolProps[];
    percentageUsed: number[];
    setPercentage: () => void;
}
const useTruenasStorageStore = create<TruenasStorageStore>((set, get) => ({
    pools: [{
        id: 0,
        name: "",
        status: "",
        size: 0,
        allocated: 0,
        free: 0,
        healthy: false
    }],
    percentageUsed: [],

    setPercentage: async () => {
        const percentage: number[] = [];
        get().pools.forEach((pool) => {
            const pct = pool.size > 0 ? pool.allocated / pool.size : 0;
            percentage.push(Number.isFinite(pct) ? pct : 0);
        });
        set({ percentageUsed: percentage });
    }

}));
export { useTruenasStorageStore }