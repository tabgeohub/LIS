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

# Optional custom nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Non-root runtime (CWE-266). Port 8080 so nginx can bind without CAP_NET_BIND_SERVICE.
RUN chown -R nginx:nginx /usr/share/nginx/html \
 && chown -R nginx:nginx /var/cache/nginx /var/log/nginx /var/run \
 && touch /var/run/nginx.pid && chown nginx:nginx /var/run/nginx.pid
USER nginx

EXPOSE 8080
CMD ["nginx", "-g", "daemon off;"]
