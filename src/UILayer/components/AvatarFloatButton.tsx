import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Sample avatar image - replace with your AvatarImage component
import { AvatarImage } from "../../DataLayer/LocalDataLayer/assets/AvatarImage";
import { useObjectImageEtagStore } from "../../OrchestraLayer/StateManager/Zustand/objectImageStore";
import { useUserProfileStore } from "../../OrchestraLayer/StateManager/Zustand/userProfileStore";
import axios from "axios";
interface AvatarFloatButtonProps {
    x: number;
    y: number;
    sizeScale?: number; // Size in pixels (default: 48)
    collaboratorDistance?: number; // Distance of collaborators from center (default: 60)
}

const CollaborateIcon: React.FC<{ size: number; collaboratorDistance: number }> = ({
    size,
    collaboratorDistance
}) => {
    const collaborators = [
        { color: "bg-red-500", delay: 0 },
        { color: "bg-blue-500", delay: 0.1 },
        { color: "bg-green-500", delay: 0.2 },
        { color: "bg-amber-500", delay: 0.3 },
        { color: "bg-violet-500", delay: 0.4 },
        { color: "bg-pink-500", delay: 0.5 },
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
                        <motion.div
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
                            className={`absolute rounded-full ${collaborator.color} border-2 border-white/90 shadow-lg`}
                            style={{
                                width: `${collaboratorSize}px`,
                                height: `${collaboratorSize}px`,
                                left: `calc(50% - ${collaboratorSize / 2}px)`,
                                top: `calc(50% - ${collaboratorSize / 2}px)`,
                            }}
                        >
                            <motion.div
                                animate={{
                                    scale: [1, 1.1, 1],
                                    opacity: [0.8, 1, 0.8]
                                }}
                                transition={{
                                    duration: 2,
                                    repeat: Infinity,
                                    delay: collaborator.delay,
                                }}
                                className="w-full h-full rounded-full bg-white/20"
                            />

                            <div className="absolute inset-1 rounded-full bg-white/40 flex items-center justify-center">
                                <div
                                    className="rounded-full bg-white/70"
                                    style={{
                                        width: `${Math.max(collaboratorSize * 0.3, 8)}px`,
                                        height: `${Math.max(collaboratorSize * 0.3, 8)}px`,
                                    }}
                                />
                            </div>
                        </motion.div>
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
    const [profileBlobUrl, setProfileBlobUrl] = useState<string>('');
    // const [coverBlobUrl, setCoverBlobUrl] = useState<string>('');

    // Fetch Image via Axios
    useEffect(() => {
        let profileUrl = '';
        let coverUrl = '';

        const loadImage = async (url: string, setter: (val: string) => void) => {
            // if (!user.profiles.alias) return;
            try {
                const response = await axios.get(url, { responseType: 'blob' });
                const localUrl = URL.createObjectURL(response.data);
                setter(localUrl);
                return localUrl;
            } catch (err) {
                console.error("Lỗi tải ảnh qua Proxy:", err);
                setter(url); // Fallback dùng link trực tiếp nếu axios lỗi
            }
        };

        const loadAll = async () => {
            profileUrl = await loadImage(ADMIN_IMAGE_URL, setProfileBlobUrl) || '';
            // coverUrl = await loadImage(COVER_PHOTO_URL, setCoverBlobUrl) || '';
        };

        loadAll();

        return () => {
            if (profileUrl) URL.revokeObjectURL(profileUrl);
            if (coverUrl) URL.revokeObjectURL(coverUrl);
        };
    }, []);



    return (
        <div
            className="fixed z-50 border-2 border-red-500 rotate-45"
            style={{
                bottom: `${x}px`,
                right: `${y}px`,
            }}
        >
            <div className="relative flex items-center justify-center">
                {/* Collaboration Icons */}
                <AnimatePresence>
                    {isExpanded && (
                        <CollaborateIcon
                            size={size}
                            collaboratorDistance={collaboratorDistance}
                        />
                    )}

                </AnimatePresence>


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
                                networkUrl={profileBlobUrl}

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
            </div>
        </div>
    );
};

export default AvatarFloatButton;