# Use the official Node.js 18 image
FROM node:18-alpine

# Create app directory
WORKDIR /usr/src/app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Bundle app source
COPY . .

# Expose the app port
EXPOSE 10000

# Start the application
CMD [ "node", "index.js" ]
