
import React, { PropsWithChildren, forwardRef } from "react";

type ColorGlassCardProps = {
  className?: string;
};

const ColorGlassCard = forwardRef<HTMLDivElement, PropsWithChildren<ColorGlassCardProps>>(
  ({ className = "", children }, ref) => {
    return (
      <div
        ref={ref}
        className={`relative 
        bg-white/30 backdrop-blur-3xl
        
        border border-white/15
        ring-1 ring-white/10
        shadow-2xl
        ${className}`}
      >
        {/* Animated blobs backdrop */}
        <div className="absolute inset-0 -z-10" aria-hidden="true">
          <div className="absolute -top-24 -left-16 h-80 w-80 rounded-full bg-indigo-200/20 blur-3xl" />
          <div className="absolute top-1/3 -right-20 h-96 w-96 rounded-full bg-indigo-300/20 blur-3xl" />
          <div className="absolute bottom-[-6rem] left-1/3 h-72 w-72 rounded-full bg-blue-300/20 blur-3xl" />
        </div>

        <div className="m-auto p-4">{children}</div>

        <style>{`
          @keyframes float {
            0%, 100% { transform: translateY(0) translateX(0) scale(1); }
            25%      { transform: translateY(-20px) translateX(10px) scale(1.05); }
            50%      { transform: translateY(10px) translateX(-10px) scale(0.98); }
            75%      { transform: translateY(-10px) translateX(-6px) scale(1.03); }
          }
          @media (prefers-reduced-motion: reduce) {
            [class*="animate-[float_"] { animation: none !important; }
          }
        `}</style>
      </div>
    );
  }
);

ColorGlassCard.displayName = "ColorGlassCard";
export default ColorGlassCard;
