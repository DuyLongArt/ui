
import React, { type PropsWithChildren, forwardRef } from "react";

type LiquidGlassButtonProps = {
  className?: string;
  onClick?: () => void;
};

const LiquidGlassButton = forwardRef<HTMLButtonElement, PropsWithChildren<LiquidGlassButtonProps>>(
  ({ className = "", children, onClick }, ref) => {
    return (
      <button
        ref={ref}
        className={`relative 
            flex
        bg-white/30 backdrop-blur-3xl
        border-2!
        border-white! 
        ring-1 ring-white/10
        shadow-2xl
        ${className}`}
        onClick={onClick}
      >
        {/* Animated blobs backdrop */}
        {/* <div className="absolute inset-0 -z-10" aria-hidden="true">
          <div className="absolute -top-24 -left-16 h-80 w-80 rounded-full bg-indigo-200/20 blur-3xl" />
          <div className="absolute top-1/3 -right-20 h-96 w-96 rounded-full bg-indigo-300/20 blur-3xl" />
          <div className="absolute bottom-[-6rem] left-1/3 h-72 w-72 rounded-full bg-blue-300/20 blur-3xl" />
        </div> */}

    {children}

      
      </button>
    );
  }
);

LiquidGlassButton.displayName = "LiquidGlassButton";
export default LiquidGlassButton;
