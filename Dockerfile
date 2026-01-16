# Stage 1: Build the React app
FROM node:22 AS build
WORKDIR /app

# No longer need Build-time ARGs for these specific variables 
# as they are now handled at runtime by entrypoint.sh

COPY package.json ./
RUN npm install && npm rebuild lightningcss rollup

COPY . .
RUN npm run build

# Stage 2: Serve the app with Nginx
FROM nginx:alpine

WORKDIR /usr/share/nginx/html

# REQUIRED for SPAs: Copy a custom nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy build files
COPY --from=build /app/dist /usr/share/nginx/html

# Copy entrypoint script and make it executable
COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

EXPOSE 22222

# Use the entrypoint script to jumpstart the app
ENTRYPOINT ["/entrypoint.sh"]