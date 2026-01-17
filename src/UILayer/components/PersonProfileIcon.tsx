
// import { useSelector } from "@xstate/react";
// import { useSelector } from "@xstate/react";
import React from "react";
import { useUserProfileStore } from "../../OrchestraLayer/StateManager/Zustand/userProfileStore";
import LiquidGlassButton from "./LiquidGlassButton";
const PersonProfileIcon: React.FC<{ onClick: () => void }> = ({ onClick }) => {

    const userProfile = useUserProfileStore((state) => state.information);




    // const userProfileStore=useSelector((state: RootState) => state.userProfileStore);
    return (
        <LiquidGlassButton onClick={onClick} className="flex! justify-start!  max-[600px]:border-none! flex-row! bg-blue-950/40!  border! border-indigo-800!   rounded-3xl! items-center">
            {/* <div onClick={onClick} className="flex items-center rounded-full!  bg-indigo-800/70!  hover:opacity-80 transition-opacity drop-shadow-sm"> */}
                <div className=" sm:w-8 sm:h-8 rounded-lg! text-[20px]  bg-indigo-700 flex items-center justify-center font-bold text-white uppercase shrink-0">
                    {userProfile.profiles.firstName?.charAt(0) || 'A'}
                </div>
     
            <div className=" font-bold text-white max-[600px]:hidden text-[15px]">
                {userProfile.profiles.firstName || 'Admin'}
            </div>
            {/* </div> */}

        </LiquidGlassButton>
    );
}
export default PersonProfileIcon;