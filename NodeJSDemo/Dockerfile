# Use the official Node.js image
FROM node:16

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json (if available)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose port 3000 (or whatever port your Node.js app uses)
EXPOSE 3000

# Start the Node.js app
CMD ["node", "server.js"]
