FROM node:latest

WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Clean node_modules, package-lock.json and rebuild bcrypt from source
RUN npm install

# Copy the rest of the app
COPY . .

# Build the NestJS app
RUN npm run build

# Expose port
EXPOSE 3000

# Start the app
CMD ["npm", "run", "start:prod"]
