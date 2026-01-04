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
}

const GlassCard: React.FC<GlassCardProps> = ({ children, className = "", onClick }) => {
  return (
    <div
      onClick={onClick}
      className={`bg-white/40 backdrop-blur-md border border-white/60 shadow-sm rounded-2xl transition-all duration-300 hover:shadow-md hover:bg-white/60 ${className}`}
    >
      {children}
    </div>
  );
};


export { GlassContainer, GlassCard };