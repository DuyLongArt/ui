/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_CLOUDFLARE_API_BEAR: string
    readonly VITE_TAILSCALE_USERNAME: string
    // more env variables...
}

interface ImportMeta {
    readonly env: ImportMetaEnv
}
