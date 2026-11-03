# Lightweight Production Dockerfile for Google Cloud Run
FROM node:18-alpine

WORKDIR /app

# Copy server, public assets, and mock data
COPY package.json ./
COPY server.js ./
COPY public ./public
COPY src ./src
COPY prisma ./prisma

# Cloud Run injects the PORT environment variable (default 8080)
ENV PORT=8080
EXPOSE 8080

CMD ["node", "server.js"]
