/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_CLOUDFLARE_API_BEAR: string
    readonly VITE_TAILSCALE_USERNAME: string
    readonly VITE_TRUENAS_BEAR: string
    readonly VITE_GROQ_API_KEY: string
    readonly VITE_SUPABASE_URL: string
    readonly VITE_SUPABASE_ANON_KEY: string
    /** Dev-only: Vite proxy target for `/api` (TrueNAS). Override when truenas.duylong.art does not resolve. */
    readonly VITE_TRUENAS_PROXY_TARGET: string
}

interface ImportMeta {
    readonly env: ImportMetaEnv
}

interface Window {
    _env_: {
        VITE_CLOUDFLARE_API_BEAR: string;
        VITE_TAILSCALE_USERNAME: string;
        VITE_TRUENAS_BEAR: string;
        VITE_GROQ_API_KEY: string;
        VITE_SUPABASE_URL: string;
        VITE_SUPABASE_ANON_KEY: string;
        VITE_TRUENAS_PROXY_TARGET: string;
    }
}
