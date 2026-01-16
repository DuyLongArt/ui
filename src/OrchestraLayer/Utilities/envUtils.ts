/**
 * Helper to get environment variables.
 * Prioritizes runtime variables from window._env_ (for Docker/TrueNAS)
 * Falls back to build-time variables from import.meta.env (for local dev)
 */
export const getEnv = (key: keyof Window['_env_']): string => {
    // Check if window._env_ exists and has the key
    if (window._env_ && window._env_[key]) {
        return window._env_[key];
    }

    // Fallback to Vite's build-time env
    return import.meta.env[key] || "";
};
