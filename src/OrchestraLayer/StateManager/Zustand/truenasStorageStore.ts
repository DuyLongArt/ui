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
        var percentage: number[] = [];
        get().pools.forEach(pool => {
            percentage.push((pool.allocated) / pool.size);
        });
        set({ percentageUsed: percentage })
    }

}));
export { useTruenasStorageStore }