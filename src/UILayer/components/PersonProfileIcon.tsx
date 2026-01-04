
// import { useSelector } from "@xstate/react";
// import { useSelector } from "@xstate/react";
import React from "react";
import { useUserProfileStore } from "../../OrchestraLayer/StateManager/Zustand/userProfileStore";
const PersonProfileIcon: React.FC<{ onClick: () => void }> = ({ onClick }) => {

    const userProfile = useUserProfileStore((state) => state.information);




    // const userProfileStore=useSelector((state: RootState) => state.userProfileStore);
    return (
        <div>
            <button onClick={onClick}>
                <div className="rounded-full overflow-hidden"></div>
                <p>{userProfile.profiles.firstName||'Admin'}</p>
            </button>
        </div>
    );
}
export default PersonProfileIcon;