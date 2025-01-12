# # Stage 1: Build the application
# FROM node:18 AS builder

# # Set the working directory inside the container
# WORKDIR /app

# # Copy the package.json to the working directory
# COPY package.json ./

# # Install dependencies using Yarn
# RUN yarn install

# # Copy the rest of the application files
# COPY . .

# # Build the application for production using Vite
# RUN yarn build

# # Stage 2: Serve the application
# FROM node:18-slim

# # Install a lightweight HTTP server
# RUN yarn global add serve

# # Set the working directory
# WORKDIR /app

# # Copy the built application from the builder stage
# COPY --from=builder /app/dist ./dist

# # Expose the port to the outside world
# EXPOSE 3000

# # Command to serve the application
# CMD ["serve", "-s", "dist", "-l", "3000"]



# Stage 1: Development Environment
FROM node:18 AS dev

# Set the working directory inside the container
WORKDIR /app

# Install Vite globally for running the dev server
RUN yarn global add vite

# Expose the port you want to use for development
EXPOSE 3000

# Default command: Start the Vite development server on port 3000
CMD ["vite", "--host", "0.0.0.0", "--port", "3000"]
