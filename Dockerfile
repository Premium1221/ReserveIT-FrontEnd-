FROM node:18

# Set working directory
WORKDIR /app

# Copy package.json and install dependencies
COPY package*.json ./
RUN npm install

# Copy the source code
COPY . .

# Expose the port used by the development server
EXPOSE 5200

# Start the application
CMD ["npm", "start"]
