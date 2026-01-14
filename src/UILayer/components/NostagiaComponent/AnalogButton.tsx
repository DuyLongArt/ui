import React from "react";

export interface AnalogButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'chrome' | 'amber' | 'vintage' | 'sepia';
    size?: 'sm' | 'md' | 'lg';
    isPressed?: boolean;
}

export const AnalogButton: React.FC<AnalogButtonProps> = ({
    children,
    variant = 'chrome',
    size = 'md',
    isPressed = false,
    className,
    ...props
}) => {
    const baseStyles = "relative inline-flex items-center justify-center font-bold tracking-wider uppercase transition-all duration-100 ease-out active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed";

    const variants = {
        chrome: "bg-linear-to-b from-gray-200 to-gray-400 text-white border-b-4 border-gray-500 hover:brightness-110 active:border-b-0 active:translate-y-1 shadow-md",
        amber: "bg-linear-to-b from-amber-400 to-amber-600 text-amber-900 border-b-4 border-amber-700 hover:brightness-110 active:border-b-0 active:translate-y-1 shadow-md",
        vintage: "bg-stone-300 text-stone-600 border-b-4 border-stone-500 hover:bg-stone-200 active:border-b-0 active:translate-y-1 shadow-sm font-mono",
        sepia: "bg-linear-to-b from-amber-200 to-amber-400 text-amber-800 border-b-4 border-amber-600 hover:brightness-110 active:border-b-0 active:translate-y-1 shadow-md"
    };

    const sizes = {
        sm: "h-8 px-3 text-xs rounded",
        md: "h-10 px-5 text-sm rounded-md",
        lg: "h-14 px-8 text-lg rounded-lg"
    };

    const pressedStyles = isPressed ? "border-b-0 translate-y-1 brightness-90 shadow-inner" : "";

    return (
        <button
            className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${pressedStyles} ${className || ''}`}
            {...props}
        >
            {children}
        </button>
    );
};
