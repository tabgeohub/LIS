FROM nginx:alpine

# Set working directory
WORKDIR /usr/share/nginx/html

# Copy the local build folder to nginx
COPY ./build/ .

# Optional: Add custom nginx config (optional for React routing)
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
