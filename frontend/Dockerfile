# Multi-stage Dockerfile for UrbanFix React 18 + Vite Frontend

# Stage 1: Build production bundle
FROM node:20-alpine AS builder

WORKDIR /app

# Copy dependency specifications
COPY package*.json ./
RUN npm ci || npm install

# Copy source code and build
COPY . .
RUN npm run build

# Stage 2: Serve with high-performance Nginx
FROM nginx:1.27-alpine

LABEL maintainer="UrbanFix AI Team"
LABEL description="UrbanFix AI Web Application (React + Vite + Tailwind)"

# Remove default nginx html files
RUN rm -rf /usr/share/nginx/html/*

# Copy built bundle from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy custom Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=3s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost/healthz || exit 1

CMD ["nginx", "-g", "daemon off;"]
