// TabNavigation.tsx
import React from "react";
import type { UserAccount, UserInformation } from "../../OrchestraLayer/StateManager/Zustand/userProfileStore";

// --- Types ---
export type TabType = {
    label: string;
    shortKey: string;
    role: 'ADMIN' | 'USER' | 'VIEWER';
}

export type ComponentShortkey = {
    [key: string]: React.ReactNode;
}

type TabNavigationProps = {
    tabs: TabType[];
    user: UserAccount;
    listTab: ComponentShortkey;
    defaultTab?: string;
}

// --- Logic ---
const ROLE_LEVELS = {
    'VIEWER': 1,
    'USER': 2,
    'ADMIN': 3
};

const TabNavigation: React.FC<TabNavigationProps> = ({ tabs, user, listTab, defaultTab }) => {
    const userLevel = ROLE_LEVELS[user.role];
    console.log("User level: " + userLevel);

    // Set default tab to the first one available or the prop provided
    const [tabShortKey, setTabShortKey] = React.useState(defaultTab || tabs[0].shortKey);
    console.log("User permission: " + user.role);

    return (
        <>
            {/* 1. Navigation Menu (Pills Style) */}
            <div className="flex bg-white/30 backdrop-blur-md text-black rounded-xl p-1 border border-white/40 w-fit">
                {tabs.map((tab) => {
                    const tabLevel = ROLE_LEVELS[tab.role];
                    const shouldShow = userLevel >= tabLevel;

                    if (!shouldShow) return null;

                    const isActive = tabShortKey === tab.shortKey;

                    return (
                        <button
                            key={tab.shortKey}
                            onClick={() => setTabShortKey(tab.shortKey)}
                            className={`px-4 py-2 text-sm font-semibold rounded-lg  text-black transition-all duration-300
                                ${isActive
                                    ? 'bg-white/20 text-white shadow-sm'
                                    : 'text-black hover:text-slate-700 hover:bg-white/20'
                                }`}
                        >
                            {tab.label}
                        </button>
                    );
                })}
            </div>

            {/* 2. Content Area */}
            <div className="">
                {tabShortKey && listTab[tabShortKey]}
            </div>
        </>
    )
}

export default TabNavigation;