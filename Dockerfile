FROM node:20.17-alpine

WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Clean node_modules
RUN npm ci

# Copy the rest of the app
COPY . .

# Build the NestJS app
RUN npm run build

# Expose port
EXPOSE 3000

# Start the app
CMD ["node", "dist/main"]
