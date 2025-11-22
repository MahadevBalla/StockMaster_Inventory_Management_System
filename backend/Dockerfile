# backend/Dockerfile
FROM node:20-alpine AS base

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci --omit=dev

# Copy source
COPY . .

ENV NODE_ENV=production

# Your server listens on 8000 (from your logs)
EXPOSE 8000

# Start the app
CMD ["npm", "start"]
