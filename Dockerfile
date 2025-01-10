# Use the official Node.js image as the base image
FROM node:18

# Set the working directory inside the container
WORKDIR /app

# Copy the package.json and yarn.lock files to the working directory
COPY package.json yarn.lock ./

# Install dependencies using Yarn
RUN yarn install

# Copy the rest of the application into the container
COPY . .

# Build the application for production using Vite
RUN yarn build

# Expose the port used by `vite preview`
EXPOSE 3000

# Command to start the production server
CMD ["yarn", "preview", "--host"]
