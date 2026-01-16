
// import { useSelector } from "@xstate/react";
// import { useSelector } from "@xstate/react";
import React from "react";
import { useUserProfileStore } from "../../OrchestraLayer/StateManager/Zustand/userProfileStore";
const PersonProfileIcon: React.FC<{ onClick: () => void }> = ({ onClick }) => {

    const userProfile = useUserProfileStore((state) => state.information);




    // const userProfileStore=useSelector((state: RootState) => state.userProfileStore);
    return (
        <div className="flex items-center">
            <button onClick={onClick} className="flex items-center gap-1.5 hover:opacity-80 transition-opacity drop-shadow-sm">
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-indigo-500 border border-white/30 flex items-center justify-center text-[10px] font-bold text-white uppercase shrink-0">
                    {userProfile.profiles.firstName?.charAt(0) || 'A'}
                </div>
                <p className="hidden sm:block text-xs font-bold text-white truncate max-w-[80px]">
                    {userProfile.profiles.firstName || 'Admin'}
                </p>
            </button>
        </div>
    );
}
export default PersonProfileIcon;