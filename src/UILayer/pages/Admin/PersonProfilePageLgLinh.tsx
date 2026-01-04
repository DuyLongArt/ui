// ProfilePage.tsx - Full Source Code
import React, { useState } from 'react';
// Note: You must install heroicons/react for the footer icons (npm install @heroicons/react)
import { HomeIcon, PhotoIcon as PhotographIcon, UsersIcon, ChatBubbleOvalLeftIcon as ChatIcon, BellIcon } from '@heroicons/react/24/outline';

// --- INTERFACES (Types.ts equivalent) ---

interface UserDetails {
    studies: string;
    location: string;
}

interface UserProfile {
    name: string;
    friends: number;
    mutual: number;
    details: UserDetails;
    profileImageUrl: string;
}

// --- STATIC DATA ---

const staticUserProfile: UserProfile = {
    name: "Lg Linh",
    friends: 208,
    mutual: 5,
    details: {
        studies: "Đại học Bách khoa Hà Nội - Hanoi University of Science and Tech...",
        location: "Thanh Hóa Province",
    },
    profileImageUrl: "https://via.placeholder.com/150",
};

// --- 1. DETAILS SECTION COMPONENT ---

interface DetailsSectionProps {
    details: UserDetails;
}

const DetailsSection: React.FC<DetailsSectionProps> = ({ details }) => {

    // Data array using the details prop
    const detailItems = [
        {
            icon: (
                // Education Icon
                <svg className="h-6 w-6 text-gray-500 mr-3 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M12 14l9-5-9-5-9 5 9 5z" /><path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055 11.952 11.952 0 005.174 15.698a12.083 12.083 0 01.665-6.479L12 14z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055 11.952 11.952 0 005.174 15.698a12.083 12.083 0 01.665-6.479L12 14zm-4 6l-2-2m-2-4l-2-2" /></svg>
            ),
            text: details.studies
        },
        {
            icon: (
                // Location Icon
                <svg className="h-6 w-6 text-gray-500 mr-3 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.8A2 2 0 0110.58 20.8L6.343 16.657A8 8 0 1117.657 16.657z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
            ),
            text: details.location
        }
    ];

    return (
        <section className="p-4">
            <h2 className="text-xl font-bold mb-3">Details</h2>

            {/* Render details using the mapped array */}
            {detailItems.map((item, index) => (
                <div key={index} className="flex items-start mb-3">
                    {item.icon}
                    <p className="text-gray-800">{item.text}</p>
                </div>
            ))}

            {/* About Info Link */}
            <div className="flex items-center text-gray-600 hover:text-blue-600 cursor-pointer mt-4 mb-4">
                {/* Dots Icon */}
                <svg className="h-6 w-6 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" /></svg>
                <p>See Lg's About Info</p>
            </div>

            {/* Placeholder for content block */}
            <div className="border-t pt-4">
                <p className="text-sm font-semibold text-gray-700 mb-2">Latest Preview</p>
                <div className="flex items-center space-x-2 p-2 rounded-lg bg-gray-50 border">
                    <img src="https://via.placeholder.com/60x40" alt="Post Preview" className="rounded-md" />
                    <p className="text-sm text-gray-600 truncate">Preview of the last post content or shared link...</p>
                </div>
            </div>
        </section>
    );
};


// --- 2. PROFILE HEADER COMPONENT ---

interface ProfileHeaderProps {
    user: UserProfile;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({ user }) => {
    return (
        <section className="p-4 pt-6">
            <div className="flex items-start mb-4">
                {/* Profile Image Container */}
                <div className="relative mr-4">
                    <div className="w-[150px] h-[150px] rounded-full overflow-hidden shadow-md border-2 border-white">
                        <img
                            src={user.profileImageUrl}
                            alt={`${user.name}'s Profile Picture`}
                            className="w-full h-full object-cover"
                        />
                    </div>
                    {/* Online Status Dot */}
                    <div className="absolute bottom-2 right-4 h-4 w-4 bg-green-500 rounded-full border-2 border-white"></div>
                </div>

                {/* Name and Stats */}
                <div>
                    <h1 className="text-2xl font-bold">{user.name}</h1>
                    <p className="text-sm text-gray-600 mt-1">
                        <span className="font-semibold text-gray-800">{user.friends}</span> friends
                        <span className="mx-1">•</span>
                        <span className="font-semibold text-gray-800">{user.mutual}</span> mutual
                    </p>
                </div>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-2">
                <button className="flex-1 flex items-center justify-center bg-gray-200 text-gray-800 font-semibold py-2 px-4 rounded-lg hover:bg-gray-300 transition duration-150">
                    {/* Friends Icon */}
                    <svg className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20v-2c0-.523-.086-1.015-.24-1.465m0 0H12m5.356 1.857A9.957 9.957 0 0012 14c-1.256 0-2.529.351-3.694 1.014L5 19h5m-2-4h2.01M12 4a4 4 0 110 8 4 4 0 010-8z" /></svg>
                    Friends
                </button>
                <button className="flex-1 flex items-center justify-center bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-150">
                    {/* Message Icon */}
                    <svg className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.614A9.706 9.706 0 015 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
                    Message
                </button>
                <button className="bg-gray-200 text-gray-800 font-semibold py-2 px-3 rounded-lg hover:bg-gray-300 transition duration-150">
                    {/* Thumbs Up Icon */}
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.444A2 2 0 0110 19v-5a2 2 0 012-2h2zm-7 0H5a2 2 0 00-2 2v7a2 2 0 002 2h2m0-7v7" /></svg>
                </button>
            </div>
        </section>
    );
};


// --- 3. MAIN PROFILE PAGE COMPONENT ---

const PersonProfilePage: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'Posts' | 'Photos' | 'Reels'>('Posts');

    return (
        <div className="bg-gray-100 min-h-screen">
            <div className="max-w-xl mx-auto bg-white shadow-lg pb-16">

                {/* Top Header/Navigation */}
                <header className="flex items-center justify-between p-4 border-b">
                    <button className="text-gray-600 hover:text-gray-800">
                        {/* Back Arrow */}
                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
                    </button>
                    <button className="text-gray-600 hover:text-gray-800">
                        {/* Three Dots Menu */}
                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" /></svg>
                    </button>
                </header>

                {/* Profile Header (Image, Name, Buttons) */}
                <ProfileHeader user={staticUserProfile} />

                {/* Tab Bar (Handling State) */}
                <nav className="flex border-b mt-4">
                    {['Posts', 'Photos', 'Reels'].map(tab => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab as 'Posts' | 'Photos' | 'Reels')}
                            className={`flex-1 py-3 text-center font-semibold transition duration-150 
                                ${activeTab === tab
                                    ? 'text-blue-600 border-b-2 border-blue-600'
                                    : 'text-gray-600 hover:text-gray-800'}`
                            }
                        >
                            {tab}
                        </button>
                    ))}
                </nav>

                {/* Details Section (Bio) */}
                <DetailsSection details={staticUserProfile.details} />

                {/* Content Placeholder */}
                <div className="p-4 text-center text-gray-500">
                    <p className="border-t pt-4">Content for the **{activeTab}** tab goes here.</p>
                </div>
            </div>

            {/* Sticky Bottom Navigation (Fixed) */}
            <footer className="fixed bottom-0 left-0 right-0 bg-white border-t flex justify-around p-3 max-w-xl mx-auto z-10">
                <HomeIcon className="h-7 w-7 text-blue-600 cursor-pointer" />
                <PhotographIcon className="h-7 w-7 text-gray-500 hover:text-gray-700 cursor-pointer" />
                <UsersIcon className="h-7 w-7 text-gray-500 hover:text-gray-700 cursor-pointer" />
                <ChatIcon className="h-7 w-7 text-gray-500 hover:text-gray-700 cursor-pointer" />
                <BellIcon className="h-7 w-7 text-gray-500 hover:text-gray-700 cursor-pointer" />
            </footer>
        </div>
    );
};

export default PersonProfilePage;
