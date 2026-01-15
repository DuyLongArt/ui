import React, { useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

interface LiquidGlassCardProps {
    children: React.ReactNode;
    className?: string;
    containerClassName?: string;
    blobColor?: string;
}

const LiquidGlassCard: React.FC<LiquidGlassCardProps> = ({
    children,
    className = "",
    containerClassName = "",
    blobColor = "bg-indigo-500/30"
}) => {
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    // Smooth transition for mouse movement
    const springConfig = { damping: 25, stiffness: 150 };
    const smoothedX = useSpring(mouseX, springConfig);
    const smoothedY = useSpring(mouseY, springConfig);

    // Dynamic rotation based on mouse position
    const rotateX = useTransform(smoothedY, [-0.5, 0.5], [5, -5]);
    const rotateY = useTransform(smoothedX, [-0.5, 0.5], [-5, 5]);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const width = rect.width;
        const height = rect.height;
        const x = (e.clientX - rect.left) / width - 0.5;
        const y = (e.clientY - rect.top) / height - 0.5;
        mouseX.set(x);
        mouseY.set(y);
    };

    const handleMouseLeave = () => {
        mouseX.set(0);
        mouseY.set(0);
    };

    return (
        <motion.div
            style={{
                perspective: 1200,
            }}
            className={`relative group ${containerClassName}`}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
        >
            <motion.div
                style={{
                    rotateX,
                    rotateY,
                    transformStyle: "preserve-3d",
                }}
                className={`relative overflow-hidden backdrop-blur-2xl border border-white/20 rounded-[2.5rem] p-8 shadow-2xl transition-all duration-500 hover:border-white/40 ${className}`}
            >
                <div className='absolute inset-0 bg-linear-to-tr from-indigo-500/10 via-transparent to-indigo-500/5 opacity-50 pointer-events-none'>


                    {/* Animated Liquid Blobs */}
                    <div className="absolute inset-0 pointer-events-none overflow-hidden">
                        <motion.div
                            animate={{
                                x: [0, 40, -20, 0],
                                y: [0, -30, 50, 0],
                                scale: [1, 1.2, 0.8, 1],
                            }}
                            transition={{
                                duration: 10,
                                repeat: Infinity,
                                ease: "linear"
                            }}
                            className={`absolute -top-1/4 -left-1/4 w-1/2 h-1/2 rounded-full blur-[80px] ${blobColor}`}
                        />
                        <motion.div
                            animate={{
                                x: [0, -50, 30, 0],
                                y: [0, 40, -60, 0],
                                scale: [1, 0.9, 1.1, 1],
                            }}
                            transition={{
                                duration: 12,
                                repeat: Infinity,
                                ease: "linear",
                                delay: 1
                            }}
                            className={`absolute -bottom-1/4 -right-1/4 w-1/2 h-1/2 rounded-full blur-[80px] ${blobColor} opacity-60`}
                        />

                        {/* Glossy Overlay Reflection */}
                        <div className="absolute inset-0 bg-linear-to-tr from-blue-600/10 via-transparent to-blue-600/5 opacity-50 pointer-events-none" />
                    </div>
                </div>

                {/* Specular highlight tracking mouse */}
                <motion.div
                    style={{
                        background: useTransform(
                            [smoothedX, smoothedY],
                            ([x, y]) => `radial-gradient(600px circle at ${(x as number + 0.5) * 100}% ${(y as number + 0.5) * 100}%, rgba(255,255,255,0.1), transparent 40%)`
                        )
                    }}
                    className="absolute inset-0 pointer-events-none z-0"
                />

                {/* Content */}
                <div className="relative z-10">
                    {children}
                </div>

                {/* Subtle Inner Glow */}
                <div className="absolute inset-0 rounded-[2.5rem] border border-white/10 pointer-events-none" />
            </motion.div>
        </motion.div>
    );
};

export default LiquidGlassCard;
