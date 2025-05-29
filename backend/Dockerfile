# Stage 1: Build the application
FROM node:20-alpine AS builder

# Set working directory
WORKDIR /app

# Install dependencies (including dev dependencies)
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

# Copy application files
COPY . .

# Build TypeScript
RUN yarn build

# Stage 2: Create production image
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Install dependencies for database operations
RUN apk add --no-cache postgresql-client

# Copy production dependencies
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile --production

# Copy built files from builder stage
COPY --from=builder /app/dist ./dist

# Copy database initialization files
COPY ./db /src/db

# Make init script executable
RUN chmod +x /src/db/init.sh

# Expose port
EXPOSE 4000

# Start the application with DB initialization
CMD ["yarn", "start"]
