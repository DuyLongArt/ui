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
import { useUserScoresQuery, useUserQuestsQuery } from '../../../../DataLayer/APILayer/userQueries';

// --- Icons ---
// ... (icons remain the same)

const PersonalPage = () => {
  const userStore = useUserProfileStore();
  const userAccountStore = useUserAccountStore();
  const user = userStore.information;

  const { data: scores } = useUserScoresQuery();
  const { data: quests } = useUserQuestsQuery();

  const stats = [
    { label: "Health", value: scores?.healthGlobalScore?.toFixed(0) || "0" },
    { label: "Social", value: scores?.socialGlobalScore?.toFixed(0) || "0" },
    { label: "Career", value: scores?.careerGlobalScore?.toFixed(0) || "0" },
    { label: "Finance", value: scores?.financialGlobalScore?.toFixed(0) || "0" }
  ];

  const recentQuests = quests?.slice(0, 3).map(q => ({
    title: q.title,
    org: q.category,
    date: q.isCompleted ? "Completed" : `${((q.currentValue / q.targetValue) * 100).toFixed(0)}%`
  })) || [
      { title: "No active quests", org: "System", date: "--" }
    ];

  const commonProps = {
    placeholder: undefined,
    onPointerEnterCapture: undefined,
    onPointerLeaveCapture: undefined,
    onResize: undefined,
    onResizeCapture: undefined,
  } as any;

  return (
    <div className="min-h-screen bg-[#141430] font-sans py-4 md:py-8 relative overflow-hidden flex items-start justify-center">
      {/* Dynamic Background Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-indigo-600/20 rounded-full mix-blend-screen filter blur-[120px] animate-blob pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-5%] w-[500px] h-[500px] bg-blue-600/20 rounded-full mix-blend-screen filter blur-[100px] animate-blob animation-delay-2000 pointer-events-none"></div>
      <div className="absolute top-[20%] right-[15%] w-[400px] h-[400px] bg-purple-600/10 rounded-full mix-blend-screen filter blur-[80px] animate-blob animation-delay-4000 pointer-events-none"></div>

      {/* Main Content Container */}
      <div className="w-full max-w-7xl px-4 md:px-6 relative z-10">
        <div className="flex flex-col gap-6">
          <div className="flex flex-wrap items-center justify-between gap-3 px-1">
            <Typography variant="small" className="text-white/50 font-medium" {...commonProps}>
              Personal hub
            </Typography>
            <a
              href="https://cv.personal.duylong.art"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-indigo-400/40 bg-indigo-500/15 px-4 py-2 text-sm font-semibold text-indigo-100 hover:bg-indigo-500/25 hover:border-indigo-300/60 transition-colors"
            >
              CV — cv.personal.duylong.art
            </a>
          </div>
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
                overview: <AboutMePage stats={stats} achievements={recentQuests} />,
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