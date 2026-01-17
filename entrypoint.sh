#!/bin/sh

# Default location of the env file in the Nginx HTML directory
ENV_FILE="/usr/share/nginx/html/env-config.js"

echo "window._env_ = {" > $ENV_FILE
echo "  VITE_CLOUDFLARE_API_BEAR: \"$VITE_CLOUDFLARE_API_BEAR\"," >> $ENV_FILE
echo "  VITE_TAILSCALE_USERNAME: \"$VITE_TAILSCALE_USERNAME\"," >> $ENV_FILE
echo "  VITE_TRUENAS_BEAR: \"$VITE_TRUENAS_BEAR\"" >> $ENV_FILE
echo "};" >> $ENV_FILE

echo "✅ Generated runtime environment config at $ENV_FILE"

# Start Nginx
exec nginx -g "daemon off;"
