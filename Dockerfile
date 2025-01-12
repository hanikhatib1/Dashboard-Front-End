# Stage 1: Build the application
FROM node:18 AS builder

# Set the working directory inside the container
WORKDIR /app

# Copy the package.json to the working directory
COPY package.json ./

# Install dependencies using Yarn
RUN yarn install

# Copy the rest of the application files
COPY . .

RUN echo "Back end URL: $VITE_BASE_URL_BACKEND"

# Build the application for production using Vite
RUN yarn build

# Stage 2: Serve the application
FROM node:18-slim

# Install a lightweight HTTP server
RUN yarn global add serve

# Set the working directory
WORKDIR /app

# Copy the built application from the builder stage
COPY --from=builder /app/dist ./dist

# Expose the port to the outside world
EXPOSE 3000

# Command to serve the application
CMD ["serve", "-s", "dist", "-l", "3000"]
