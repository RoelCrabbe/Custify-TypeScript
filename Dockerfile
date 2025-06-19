# Use official Node.js 18 base image
FROM node:18

# Set working directory inside container
WORKDIR /usr/src/app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm ci

# Copy the rest of your application code
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Build your TypeScript app (optional — comment out if not needed)
RUN npm run build

# Expose the port your app runs on
EXPOSE 8080

# Start the app using npm start (for production)
CMD ["npm", "start"]
