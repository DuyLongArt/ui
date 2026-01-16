# Stage 1: Build the React app
FROM node:22 AS build
WORKDIR /app

# Define build arguments for Vite
ARG VITE_TAILSCALE_USERNAME
ARG VITE_CLOUDFLARE_API_BEAR

# Set them as environment variables so Vite can use them during 'npm run build'
ENV VITE_TAILSCALE_USERNAME=$VITE_TAILSCALE_USERNAME
ENV VITE_CLOUDFLARE_API_BEAR=$VITE_CLOUDFLARE_API_BEAR

COPY package.json ./
RUN npm install && npm rebuild lightningcss rollup

COPY . .
RUN npm run build

# Stage 2: Serve the app with Nginx
FROM nginx:alpine

# REQUIRED for SPAs: Copy a custom nginx config to handle client-side routing
# (See the config block below)

WORKDIR /etc/nginx/conf.d
COPY nginx.conf /etc/nginx/conf.d/default.conf

# If using Vite, change /app/build to /app/dist
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 22222
CMD ["nginx", "-g", "daemon off;"]