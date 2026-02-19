# Stage 1: Build
FROM node:20-alpine AS build
WORKDIR /app

# Install bash (required by some npm scripts)
RUN apk add --no-cache bash

# Install dependencies
COPY package*.json ./
RUN npm ci --legacy-peer-deps

# Install Angular CLI globally
RUN npm install -g @angular/cli

# Copy source files
COPY . .

# Build the Angular application (production)
RUN ng build --configuration production

# Stage 2: Production serve with nginx
FROM nginx:alpine AS production

# Copy custom nginx config if you have one
COPY nginx.conf /etc/nginx/nginx.conf

# Copy built Angular app
COPY --from=build /app/dist/smart-mobility-simulator-ui /usr/share/nginx/html

# Install timezone data
RUN apk add --no-cache tzdata

# Set timezone to UAE
ENV TZ=Asia/Dubai
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

# Expose port
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost/ || exit 1

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
