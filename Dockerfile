# Use the official Node.js image as the base image
FROM node:18

# Set the working directory inside the container
WORKDIR /app

# Copy the package.json and yarn.lock files to the working directory
COPY package.json yarn.lock ./

# Install project dependencies using Yarn
RUN yarn install

# Copy the rest of the project files into the working directory
COPY . .

# Expose the port your React app runs on (default is 3000)
EXPOSE 3000

# Start the React development server
CMD ["yarn", "start"]
