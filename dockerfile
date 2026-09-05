###############################################################################
# 1) BUILD STAGE — build React app
###############################################################################
FROM node:20-slim AS build
WORKDIR /usr/src/app

# Install dependencies
COPY package.json package-lock.json ./
RUN npm ci --legacy-peer-deps

# Copy source code and env file
COPY . .

# Build frontend
RUN npm run build \
 && ls -la build \
 && test -d build

###############################################################################
# 2) RUNTIME STAGE — serve built app with nginx
###############################################################################
FROM nginx:alpine
WORKDIR /usr/share/nginx/html

# Copy the built frontend from build stage
COPY --from=build /usr/src/app/build/ ./

# Optional custom nginx config (listens on 8080 for non-root)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Run as non-root (nginx image provides uid/gid 101)
RUN chown -R nginx:nginx /usr/share/nginx/html /var/cache/nginx /var/log/nginx /etc/nginx/conf.d \
 && sed -i 's|^pid .*|pid /tmp/nginx.pid;|' /etc/nginx/nginx.conf \
 && sed -i 's/user  nginx;/# user nginx;/' /etc/nginx/nginx.conf
USER nginx

EXPOSE 8080
CMD ["nginx", "-g", "daemon off;"]
