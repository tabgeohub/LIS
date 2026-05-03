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

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]