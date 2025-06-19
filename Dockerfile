# Use official Node.js 18 base image
FROM node:18

# Set working directory inside container
WORKDIR /usr/src/app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm ci
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Build your TypeScript app (optional — comment out if not needed)
RUN npm run build

EXPOSE 3000
CMD ["npm", "start"]
