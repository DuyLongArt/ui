import spinConfig from './spin.json';
// Interface for the 'style' object inside 'props'
interface MotionStyle {
    width: string;
    height: string;
    cursor: string;
    // You can add other CSS properties here as needed
    [key: string]: string;
}

// Interface for the main 'props' object
interface General {
    name: string;
    style: MotionStyle;
}

// Interface for the 'animate' object
interface MotionAnimate {
    rotate: number;
    // You can add other animatable properties here (e.g., scale, opacity)
    [key: string]: number | string;
}

// Interface for the 'transition' object
interface MotionTransition {
    repeat: 'Infinity' | number; // Can be the string "Infinity" or a number
    ease: "linear" | "easeIn" | "easeOut" | "easeInOut"; // More specific types
    duration: number;
}

// Interface for the 'animationConfig' object
interface MotionAnimationConfig {
    trigger: "whileHover" | "whileTap" | "animate"; // More specific types
    animate: MotionAnimate;
    transition: MotionTransition;
}

// The main, top-level interface for the entire JSON configuration
interface MotionComponentConfig {
    component: string;
    library: string;
    element: string;
    general: General;
    animationConfig: MotionAnimationConfig;
}

// Example usage:
export const config: MotionComponentConfig = spinConfig as MotionComponentConfig;

// console.log("Config: "+config.general.name);