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
  const [activeTab, setActiveTab] = useState('cv');

  // CV State
  const [cvFile, setCvFile] = useState(null);
  const [cvPreviewUrl, setCvPreviewUrl] = useState(null);
  const fileInputRef = useRef(null);
  const userStore = useUserProfileStore();  // Mock data
  const user = userStore.information;
  const userAccountStore = useUserAccountStore();
  useEffect(() => {
    // userAccountStore.getUserRole();
  }, []);

  const stats = [
    { label: "Projects", value: 42 },
    { label: "Clients", value: 38 },
    { label: "Coffee", value: 847 },
    { label: "Awards", value: 12 }
  ];

  const skills = [
    { name: "UI/UX Design", level: 95 },
    { name: "Figma", level: 90 },
    { name: "React", level: 75 },
    { name: "Typography", level: 88 },
    { name: "User Research", level: 82 }
  ];

  const recentProjects = [
    {
      title: "E-commerce App",
      description: "Redesign of shopping experience",
      status: "Completed",
      image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&h=300&fit=crop"
    },
    {
      title: "SaaS Dashboard",
      description: "Analytics for B2B platform",
      status: "In Progress",
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=300&fit=crop"
    },
    {
      title: "Brand Identity",
      description: "Visual identity for startup",
      status: "Review",
      image: "https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=400&h=300&fit=crop"
    }
  ];

  const achievements = [
    { title: "Designer of the Year", org: "Design Awards", date: "Jan 2024" },
    { title: "UX Excellence", org: "Tech Summit", date: "Sep 2023" },
    { title: "Innovation Award", org: "Creative Guild", date: "Jun 2023" }
  ];

  // Handlers
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type === "application/pdf") {
      setCvFile(file);
      const fileUrl = URL.createObjectURL(file);
      setCvPreviewUrl(fileUrl);
    } else {
      alert("Please upload a PDF file.");
    }
  };

  const triggerUpload = () => {
    if (fileInputRef.current) fileInputRef.current.click();
  }

  // Styles

  const glassContainer = "bg-white/40 backdrop-blur-2xl border border-white/50 shadow-2xl";
  const glassCard = "bg-white/50 backdrop-blur-md border border-white/60 shadow-sm rounded-2xl transition-all duration-300 hover:shadow-md hover:bg-white/60";
  // console.log("User permission parent: " + user.profiles.role);
  return (
    // Normal Page Layout container
    <div className="min-h-screen bg-slate-50 font-sans border-2 border-b-black py-2  relative overflow-x-hidden flex items-center justify-center">

      {/* Background Blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-purple-200/60 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob pointer-events-none"></div>
      <div className="absolute top-0 right-[-5%] w-[400px] h-[400px] bg-blue-200/60 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000 pointer-events-none"></div>
      <div className="absolute bottom-[-10%] left-[20%] w-[600px] h-[600px] bg-pink-200/60 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-4000 pointer-events-none"></div>

      {/* Main Content Card - Fixed Width Constraints */}
      <div className={`w-full max-h-min  max-w-7xl rounded-3xl flex flex-col relative z-10 ${glassContainer}`}>

        {/* Header Section */}
        <div className="shrink-0 p-8 md:p-8 border-b border-white/30 bg-white/10 rounded-t-3xl">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div>
              <Typography variant="h3" className="text-black font-semibold tracking-tight" placeholder="" onPointerEnterCapture={() => { }} onPointerLeaveCapture={() => { }} onResize={() => { }} onResizeCapture={() => { }}>
                {user.profiles.firstName}
              </Typography>
              <Typography className="text-black font-medium flex items-center gap-2" placeholder="" onPointerEnterCapture={() => { }} onPointerLeaveCapture={() => { }} onResize={() => { }} onResizeCapture={() => { }}>
                {user.details.occupation} <span className="w-1 h-1 bg-slate-400 rounded-full"></span> {user.details.location}
              </Typography>
            </div>

            {/* Navigation Pills */}

          </div>
        </div>

        {/* Content Area */}
        <div className="relative min-h-[500px]">

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

      <style>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob {
          animation: blob 7s infinite;
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