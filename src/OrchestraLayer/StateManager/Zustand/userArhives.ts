import axios from 'axios';
import { create } from 'zustand';



interface UserArhive {
    category: string;
    content: string;
}
interface UserArhiveState {
    archive: UserArhive[]
}
const userArhiveStore = create<UserArhiveState>((set, get) => ({
    archive:

        [
            {
                category: "",
                content: ""
            }
        ],

    getArchive: () => () => {

        const listArchives = axios.get("/backend/person/archive").then((res) => {
            set((state) => ({
                ...state,
                archive: res.data
            }))
        })
    }

}))

export { userArhiveStore };