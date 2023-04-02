# Use an official Node.js runtime as a parent image
FROM node:16-alpine

# Set the working directory in the container to /app
WORKDIR /app

# Copy the package.json and package-lock.json files to the container
COPY package*.json ./

# Install the dependencies specified in package.json
RUN npm install

# Copy the rest of the application code to the container
COPY . .

# Expose port 3000 so that it can be accessed outside the container
EXPOSE 3000

# Set the command to start the application when the container starts
CMD [ "npm", "start" ]