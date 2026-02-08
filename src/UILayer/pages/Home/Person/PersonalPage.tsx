import { useState, useRef, useEffect } from 'react';
import {
  Card,
  CardBody,
  Typography,
  Button,
} from "@material-tailwind/react";
import AboutMePage from './AboutMePage';
import { useUserAccountStore, useUserProfileStore } from '../../../../OrchestraLayer/StateManager/Zustand/userProfileStore';
import TabNavigation from '../../../components/TabNavigation';
import SkillPage from './SkillPage';
import ProjectPage from './ProjectPage';

// --- Icons ---
const CloudArrowUpIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.2} stroke="currentColor" className="w-12 h-12 text-blue-500/80">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />
  </svg>
);

const PencilIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
    <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125" />
  </svg>
);

const DocumentIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-blue-500">
    <path fillRule="evenodd" d="M5.625 1.5H9a3.75 3.75 0 0 1 3.75 3.75v1.875c0 1.036.84 1.875 1.875 1.875H16.5a3.75 3.75 0 0 1 3.75 3.75v7.875c0 1.035-.84 1.875-1.875 1.875H5.625a1.875 1.875 0 0 1-1.875-1.875V3.375c0-1.036.84-1.875 1.875-1.875ZM12.75 12a.75.75 0 0 0-1.5 0v2.25H9a.75.75 0 0 0 0 1.5h2.25V18a.75.75 0 0 0 1.5 0v-2.25H15a.75.75 0 0 0 0-1.5h-2.25V12Z" clipRule="evenodd" />
    <path d="M14.25 5.25a.75.75 0 0 0-.75.75v2.25c0 .414.336.75.75.75h2.25a.75.75 0 0 0 .75-.75V5.25a.75.75 0 0 0-.75-.75h-2.25Z" />
  </svg>
);

const PersonalPage = () => {
  const userStore = useUserProfileStore();
  const userAccountStore = useUserAccountStore();
  const user = userStore.information;

  const stats = [
    { label: "Projects", value: 42 },
    { label: "Clients", value: 38 },
    { label: "Coffee", value: 847 },
    { label: "Awards", value: 12 }
  ];

  const achievements = [
    { title: "Designer of the Year", org: "Design Awards", date: "Jan 2024" },
    { title: "UX Excellence", org: "Tech Summit", date: "Sep 2023" },
    { title: "Innovation Award", org: "Creative Guild", date: "Jun 2023" }
  ];

  return (
    <div className="min-h-screen bg-[#141430] font-sans py-4 md:py-8 relative overflow-hidden flex items-start justify-center">
      {/* Dynamic Background Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-indigo-600/20 rounded-full mix-blend-screen filter blur-[120px] animate-blob pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-5%] w-[500px] h-[500px] bg-blue-600/20 rounded-full mix-blend-screen filter blur-[100px] animate-blob animation-delay-2000 pointer-events-none"></div>
      <div className="absolute top-[20%] right-[15%] w-[400px] h-[400px] bg-purple-600/10 rounded-full mix-blend-screen filter blur-[80px] animate-blob animation-delay-4000 pointer-events-none"></div>

      {/* Main Content Container */}
      <div className="w-full max-w-7xl px-4 md:px-6 relative z-10">
        <div className="flex flex-col gap-6">
          {/* Navigation & Content Wrapper */}
          <div className="relative rounded-[2.5rem] overflow-hidden border border-white/10 bg-white/5 backdrop-blur-3xl shadow-2xl">
            <TabNavigation
              tabs={[
                { label: 'Overview', shortKey: 'overview', role: 'VIEWER' },
                { label: 'Skills', shortKey: 'skills', role: 'VIEWER' },
                { label: 'Project', shortKey: 'projects', role: 'VIEWER' },
              ]}
              user={userAccountStore.account}
              listTab={{
                overview: <AboutMePage stats={stats} achievements={achievements} />,
                projects: <ProjectPage />,
                skills: <SkillPage />,
              }}
              defaultTab="overview"
            />
          </div>
        </div>
      </div>

      <style>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(40px, -60px) scale(1.1); }
          66% { transform: translate(-30px, 30px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob {
          animation: blob 10s infinite alternate cubic-bezier(0.45, 0, 0.55, 1);
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
};

export default PersonalPage;