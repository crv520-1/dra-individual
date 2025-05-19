# Stage 1: Build the React application
FROM node:24-alpine AS build

WORKDIR /app

# Copy package.json and package-lock.json (if available)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the application
RUN npm run build

# Stage 2: Serve the application
FROM node:24-alpine

WORKDIR /app

# Install 'serve' to serve static files
RUN npm install -g serve

# Copy the built application from the build stage
COPY --from=build /app/dist ./dist

# Expose the port the app will run on
EXPOSE 5000

# Command to serve the app
CMD ["serve", "-s", "dist", "-l", "5000"]