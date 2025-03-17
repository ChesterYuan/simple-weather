FROM node:18-alpine as build

# Set working directory
WORKDIR /app

# Copy package.json files
COPY package*.json ./
COPY src/frontend/package*.json ./src/frontend/

# Install dependencies
RUN npm run install-all

# Copy all files
COPY . .

# Build frontend
RUN npm run build

# Production stage
FROM node:18-alpine

WORKDIR /app

# Copy package.json and install production dependencies
COPY package*.json ./
RUN npm install --only=production

# Copy built app from build stage
COPY --from=build /app/public ./public
COPY --from=build /app/src/api ./src/api

# Expose port
EXPOSE 3000

# Start the app
CMD ["npm", "start"]
