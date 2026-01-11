import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { config } from '../../OrchestraLayer/ThemeLayer/Animation/SpinConfigProtocol.ts';

interface ImageUrlInterface {
    imageUrl: string;
    fallbackUrl?: string; // Added optional fallback
}

const MotionImageSpinner: React.FC<ImageUrlInterface> = ({
    imageUrl,
    fallbackUrl = 'http://backend.duylong.art/object/duylongwebappobjectdatabase/admin.png'
}) => {
    // State to handle network load errors
    const [imgSrc, setImgSrc] = useState<string>(imageUrl);
    const [isLoaded, setIsLoaded] = useState(false);

    const animationProps = {
        [config.animationConfig.trigger]: {
            ...config.animationConfig.animate,
            transition: {
                ...config.animationConfig.transition,
                repeat: config.animationConfig.transition.repeat === 'Infinity'
                    ? Infinity
                    : config.animationConfig.transition.repeat,
            },
        },
    };

    return (
        <div style={{ ...config.general.style, position: 'relative', overflow: 'hidden' }}>
            {/* 1. Optional: Loading Skeleton/Pulse */}
            {!isLoaded && (
                <div className="absolute inset-0 bg-gray-200 animate-pulse rounded-full" />
            )}

            <motion.img
                // The source is controlled by state to allow for fallbacks
                src={imgSrc}
                alt={config.general.name}

                // 2. Network Event Handlers
                onLoad={() => setIsLoaded(true)}
                onError={() => {
                    console.error(`❌ Failed to load network image: ${imageUrl}`);
                    setImgSrc(fallbackUrl);
                }}

                style={{
                    ...config.general.style,
                    display: isLoaded ? 'block' : 'none', // Hide until ready
                    objectFit: 'cover'
                }}

                {...animationProps}
                // Ensure smoothness if the trigger is "animate" (constant spinning)
                initial={config.animationConfig.trigger === 'animate' ? { rotate: 0 } : {}}
            />
        </div>
    );
};

export default MotionImageSpinner;