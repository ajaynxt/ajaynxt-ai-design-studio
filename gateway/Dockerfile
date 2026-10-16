# Multi-stage production Dockerfile for Cloud Run
FROM node:20-alpine AS base

WORKDIR /usr/src/app

# Install production dependencies
COPY package*.json ./
RUN npm ci --only=production

# Copy application source
COPY . .

# Set environment
ENV NODE_ENV=production
ENV PORT=8080

EXPOSE 8080

# Run with non-root user for security hardening
USER node

CMD ["node", "src/server.js"]
