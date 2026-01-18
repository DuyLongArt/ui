import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Sample avatar image - replace with your AvatarImage component
import { AvatarImage } from "../../DataLayer/LocalDataLayer/assets/AvatarImage";
import { useObjectImageEtagStore } from "../../OrchestraLayer/StateManager/Zustand/objectImageStore";
import { useUserProfileStore } from "../../OrchestraLayer/StateManager/Zustand/userProfileStore";
import { ChatBox } from "./ChatBox";
import { AirplayIcon, Icon, Search } from "lucide-react";
const ChatGPTIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48"><path fill="none" stroke="currentColor" stroke-linejoin="round" d="M18.38 27.94v-14.4l11.19-6.46c6.2-3.58 17.3 5.25 12.64 13.33" stroke-width="1"/><path fill="none" stroke="currentColor" stroke-linejoin="round" d="m18.38 20.94l12.47-7.2l11.19 6.46c6.2 3.58 4.1 17.61-5.23 17.61" stroke-width="1"/><path fill="none" stroke="currentColor" stroke-linejoin="round" d="m24.44 17.44l12.47 7.2v12.93c0 7.16-13.2 12.36-17.86 4.28" stroke-width="1"/><path fill="none" stroke="currentColor" stroke-linejoin="round" d="M30.5 21.2v14.14L19.31 41.8c-6.2 3.58-17.3-5.25-12.64-13.33" stroke-width="1"/><path fill="none" stroke="currentColor" stroke-linejoin="round" d="m30.5 27.94l-12.47 7.2l-11.19-6.46c-6.21-3.59-4.11-17.61 5.22-17.61" stroke-width="1"/><path fill="none" stroke="currentColor" stroke-linejoin="round" d="m24.44 31.44l-12.47-7.2V11.31c0-7.16 13.2-12.36 17.86-4.28" stroke-width="1"/></svg>
    // <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M16.612 4.42a2.1 2.1 0 0 0-2.018-1.512h-.614a2.106 2.106 0 0 0-2.072 1.725l-1.053 5.736l.262-.894a2.105 2.105 0 0 1 2.018-1.516h3.57l1.499.582l1.445-.582h-.423a2.1 2.1 0 0 1-2.018-1.512zM7.605 19.576a2.105 2.105 0 0 0 2.023 1.52h1.307a2.1 2.1 0 0 0 2.103-2.05l.142-5.53l-.298 1.013a2.1 2.1 0 0 1-2.018 1.512H7.262l-1.284-.698l-1.392.698h.413c.939 0 1.761.618 2.023 1.52z" /><path fill="currentColor" d="M14.505 2.903H7.214c-2.086 0-3.335 2.752-4.166 5.509c-.992 3.263-2.286 7.63 1.453 7.63H7.65a2.11 2.11 0 0 0 2.028-1.526a884 884 0 0 1 2.263-7.802c.382-1.294.702-2.401 1.191-3.095a1.63 1.63 0 0 1 1.374-.716" /><path fill="currentColor" d="M14.505 2.903H7.214c-2.086 0-3.335 2.752-4.166 5.509c-.992 3.263-2.286 7.63 1.453 7.63H7.65a2.11 2.11 0 0 0 2.028-1.526a884 884 0 0 1 2.263-7.802c.382-1.294.702-2.401 1.191-3.095a1.63 1.63 0 0 1 1.374-.716M9.499 21.097h7.292c2.085 0 3.334-2.757 4.165-5.509c.988-3.263 2.281-7.629-1.458-7.629H16.35c-.942 0-1.77.622-2.027 1.53a843 843 0 0 1-2.263 7.802c-.382 1.294-.703 2.406-1.192 3.095a1.62 1.62 0 0 1-1.369.711" /><path fill="currentColor" d="M9.499 21.097h7.292c2.085 0 3.334-2.757 4.165-5.509c.988-3.263 2.281-7.629-1.458-7.629H16.35c-.942 0-1.77.622-2.027 1.53a843 843 0 0 1-2.263 7.802c-.382 1.294-.703 2.406-1.192 3.095a1.62 1.62 0 0 1-1.369.711" /></svg>
);

interface AvatarFloatButtonProps {
    x: number;
    y: number;
    sizeScale?: number; // Size in pixels (default: 48)
    collaboratorDistance?: number; // Distance of collaborators from center (default: 60)
}

const CollaborateIcon: React.FC<{ size: number; collaboratorDistance: number, parentAction: (action: string) => void }> = ({
    size,
    parentAction,
    collaboratorDistance
}) => {
    // const [chatBoxOpen, setChatBoxOpen] = useState(false);
    const collaborators = [
        { color: "bg-indigo-900/90", delay: 0, onClick: () => { parentAction("ChatBox") }, icon: "ChatBox" },
        { color: "bg-blue-500/90", delay: 0.1 },
        { color: "bg-green-500/90", delay: 0.2 },
        { color: "bg-amber-500/90", delay: 0.3 },
        { color: "bg-violet-500/90", delay: 0.4 },
        { color: "bg-pink-500/90", delay: 0.5 },
    ];

    const positions = [
        { x: 0, y: -collaboratorDistance },
        { x: collaboratorDistance * 0.866, y: -collaboratorDistance * 0.5 },
        { x: collaboratorDistance * 0.866, y: collaboratorDistance * 0.5 },
        { x: 0, y: collaboratorDistance },
        { x: -collaboratorDistance * 0.866, y: collaboratorDistance * 0.5 },
        { x: -collaboratorDistance * 0.866, y: -collaboratorDistance * 0.5 },
    ];

    const collaboratorSize = Math.max(size * 0.4, 20); // Min 20px, or 40% of main size

    return (
        <div className="absolute inset-0 pointer-events-none">
            <AnimatePresence>
                {collaborators.map((collaborator, index) => {
                    const position = positions[index];
                    return (
                        <motion.button
                            key={index}

                            initial={{ x: 0, y: 0, opacity: 0, scale: 0 }}
                            animate={{
                                x: position.x,
                                y: position.y,
                                opacity: 1,
                                scale: 1,
                            }}
                            exit={{ x: 0, y: 0, opacity: 0, scale: 0 }}
                            transition={{
                                type: "spring",
                                stiffness: 200,
                                damping: 20,
                                delay: collaborator.delay,
                            }}
                            className={`absolute ${collaborator.color}! shadow-lg hover:scale-110 hover:shadow-xl pointer-events-auto active:scale-90 transition-transform`}
                            style={{
                                zIndex: 100,
                                width: `${collaboratorSize * 1.6}px`,
                                height: `${collaboratorSize * 1.6}px`,
                                left: `calc(50% - ${collaboratorSize}px)`,
                                top: `calc(50% - ${collaboratorSize}px)`,
                            }}
                            onClick={(e) => {
                                e.stopPropagation();
                                collaborator.onClick();
                            }}
                        >
                            {/* <button style={{
                                width: `${collaboratorSize}px`,
                                height: `${collaboratorSize}px`,
                                left: `calc(50% - ${collaboratorSize / 2}px)`,
                                top: `calc(50% - ${collaboratorSize / 2}px)`,
                            }} className="w-10  h-10 border-4! z-60 border-black! rounded-full! " onClick={() => { alert("click") }} /> */}
                            <div className={`absolute inset-1 rounded-full ${collaborator.color} backdrop-blur-sm flex items-center justify-center`}>

                                {collaborator.icon === "ChatBox" && <ChatGPTIcon />}
                            </div>
                        </motion.button>
                    );
                })}
            </AnimatePresence>
        </div>
    );
};
const StarEffect: React.FC<{ rotatingBorderSize: number; glowSize1: number, glowSize2: number }> = ({ rotatingBorderSize, glowSize1, glowSize2 }) => {
    {/* Rotating Border */ }
    return (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <motion.div
                animate={{ rotate: 360 }}
                transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "linear",
                }}
                className="absolute border-2 border-transparent border-t-blue-500 border-r-blue-500 rounded-full opacity-70"
                style={{
                    width: `${rotatingBorderSize}px`,
                    height: `${rotatingBorderSize}px`,
                }}
            />



            <motion.div
                animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.3, 0.1, 0.3]
                }}
                transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                }}
                className="absolute rounded-full bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 -z-10"
                style={{
                    width: `${glowSize1}px`,
                    height: `${glowSize1}px`,
                }}
            />

            <motion.div

                animate={{
                    scale: [1.2, 1.4, 1.2],
                    opacity: [0.1, 0.05, 0.1]
                }}
                transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 1,
                }}
                className="absolute rounded-full bg-gradient-to-br from-cyan-400 via-blue-500 to-purple-600 -z-20"
                style={{
                    width: `${glowSize2}px`,
                    height: `${glowSize2}px`,
                }}
            />
        </div>
    );
}
const FloatingParticle: React.FC<{ size: number; delay: number }> = ({ size, delay }) => {
    return (
        <div className="absolute inset-0 pointer-events-none">
            {[...Array(8)].map((_, i) => (
                <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0, x: 0, y: 0 }}
                    animate={{
                        opacity: [0, 1, 0],
                        scale: [0, 1, 0],
                        x: Math.cos((i * Math.PI * 2) / 8) * (size * 0.8),
                        y: Math.sin((i * Math.PI * 2) / 8) * (size * 0.8),
                    }}
                    transition={{
                        duration: 2,
                        repeat: Infinity,
                        delay: i * 0.1,
                        ease: "easeOut",
                    }}
                    className="absolute bg-blue-400 rounded-full left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2"
                    style={{
                        width: `${Math.max(size * 0.08, 4)}px`,
                        height: `${Math.max(size * 0.08, 4)}px`,
                    }}
                />
            ))}
        </div>);
}
const RippleEffect: React.FC<{ size: number }> = ({ size }) => {
    return (
        <motion.div
            initial={{ scale: 0, opacity: 0.8 }}
            animate={{ scale: 2.5, opacity: 0 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="absolute rounded-full border-2 border-blue-400 pointer-events-none"
            style={{
                width: `${size}px`,
                height: `${size}px`,
            }}
        />
    );
}
const AvatarFloatButton: React.FC<AvatarFloatButtonProps> = ({
    x,
    y,
    sizeScale = 1,
    collaboratorDistance = 60
}) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [chatBoxOpen, setChatBoxOpen] = useState(false);
    const handleToggle = () => {




        setIsExpanded(!isExpanded);
    };
    const size = sizeScale * 48;
    // Calculate responsive sizes
    const borderWidth = Math.max(Math.floor(size * 0.08), 2); // 8% of size, min 2px
    const rotatingBorderSize = size + 16;
    const glowSize1 = size + 12;
    const glowSize2 = size + 24;
    const statusSize = Math.max(Math.floor(size * 0.25), 12); // 25% of size, min 12px
    const badgeSize = Math.max(Math.floor(size * 0.375), 18); // 37.5% of size, min 18px
    // Calculate avatar size properly
    const avatarSize = Math.max(size - borderWidth * 6, 20);

    const imageObjectStore = useObjectImageEtagStore();
    const userStore = useUserProfileStore();
    // const admisnUrl = "http://192.168.22.4:9000/duylongwebappobjectdatabase/admin.png";
    const ADMIN_IMAGE_URL = `https://backend.duylong.art/object/duylongwebappobjectdatabase/${userStore.information.profiles.alias}/admin.png?v=${imageObjectStore.versions.avatarVersion}`;
    // URL is stable (until version changes), so let the browser handle caching naturally.
    // We don't need to manually fetch blob and create object URL, which causes "reloading" effect.


    const parentAction = (action: string) => {
        switch (action) {
            case "ChatBox":
                setChatBoxOpen(!chatBoxOpen);
                setIsExpanded(false);
                break;
            default:
                break;
        }
    }

    return (
        <div>
            {chatBoxOpen && <ChatBox />}
            <div
                className="fixed z-50 rotate-45"
                style={{
                    bottom: `${x}px`,
                    right: `${y}px`,
                }}
            >
                <div className="relative flex items-center justify-center">



                    <StarEffect glowSize1={glowSize1} glowSize2={glowSize2} rotatingBorderSize={rotatingBorderSize} />
                    {/* Main Avatar Button */}
                    <motion.button
                        onClick={handleToggle}
                        whileHover={{ scale: 1.05, y: -2 }}
                        whileTap={{ scale: 0.95 }}
                        className="rounded-full flex items-center border-2  justify-center rotate-45 bg-white/95 backdrop-blur-xl border-white/30 shadow-2xl hover:shadow-3xl transition-all duration-300 ease-out hover:bg-white z-10"
                        style={{

                            width: `${size}px`,
                            height: `${size}px`,
                            borderWidth: `${borderWidth}px`,
                            borderColor: '#4f46e5', // indigo-600
                            boxShadow: `
              0 8px 32px rgba(0, 0, 0, 0.12),
              0 4px 16px rgba(0, 0, 0, 0.08),
              inset 0 1px 0 rgba(255, 255, 255, 0.6)
            `,
                        }}
                    >
                        <motion.div
                            animate={{ rotate: isExpanded ? 360 : 0 }}
                            transition={{ duration: 0.3, ease: "easeInOut" }}
                            className=" rounded-full border-2 border-white/20"
                        // style={{
                        //     width: "50px",
                        //     height:"50px",
                        // }}
                        >
                            <div
                                className=" rounded-full rotate-270 block "
                                style={{
                                    width: `${avatarSize}px`,
                                    height: `${avatarSize}px`,
                                }}
                            >


                                <AvatarImage width={avatarSize} height={avatarSize}
                                    networkUrl={ADMIN_IMAGE_URL}
                                />
                            </div>
                        </motion.div>
                    </motion.button>

                    {/* Ripple Effect on Click */}
                    <AnimatePresence>
                        {isExpanded && (
                            <RippleEffect size={size + 10} />

                        )}
                    </AnimatePresence>

                    {/* Status indicator */}
                    <motion.div
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{
                            duration: 1.5,
                            repeat: Infinity,
                            ease: "easeInOut",
                        }}
                        className="absolute bg-green-400 rounded-full border-2 border-white shadow-lg z-20"
                        style={{
                            width: `${statusSize}px`,
                            height: `${statusSize}px`,
                            top: '-2px',
                            right: '-2px',
                        }}
                    />

                    {/* Notification badge */}
                    {!isExpanded && (
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0 }}
                            className="absolute bg-red-500 text-white rounded-full flex items-center justify-center font-bold shadow-lg z-30"
                            style={{
                                width: `${badgeSize}px`,
                                height: `${badgeSize}px`,
                                fontSize: `${Math.max(badgeSize * 0.5, 10)}px`,
                                top: '-4px',
                                right: '-4px',
                            }}
                        >

                        </motion.div>
                    )}

                    {/* Floating particles */}
                    {isExpanded && (
                        <FloatingParticle size={size * 1.5} delay={0} />
                    )}

                    {/* Collaboration Icons - Moved here for better stacking */}
                    <AnimatePresence>
                        {isExpanded && (
                            <div className="absolute inset-0 pointer-events-none">
                                <CollaborateIcon
                                    size={size}
                                    parentAction={parentAction}
                                    collaboratorDistance={collaboratorDistance}
                                />
                            </div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
};

export default AvatarFloatButton;