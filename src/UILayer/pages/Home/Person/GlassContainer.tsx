import React from 'react';

// 1. The Container Component
interface GlassContainerProps {
  children: React.ReactNode;
  className?: string;
}

const GlassContainer: React.FC<GlassContainerProps> = ({ children, className = "" }) => {
  return (
    <div className={`bg-white/40 backdrop-blur-2xl border border-white/50 shadow-2xl ${className}`}>
      {children}
    </div>
  );
};

// 2. The Card Component
interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  color?: string;
}

const GlassCard: React.FC<GlassCardProps> = ({ children, color = " from-indigo-500/50 via-indigo-500/60 to-indigo-500/30 ", className = "", onClick }) => {
  return (
    <div
      onClick={onClick}
      className={` backdrop-blur-md border text-white! border-white opacity-90 rounded-2xl shadow-2xl  transition-all duration-300 hover:shadow-2xs hover:bg-white/60 bg-linear-to-br ${color} ${className}  `}
    >
      {children}
    </div>
  );
};


export { GlassContainer, GlassCard };