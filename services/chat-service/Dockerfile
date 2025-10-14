# Stage 1: Build stage
FROM node:20-alpine3.22 AS builder

WORKDIR /builds

# Copy package files
COPY package.json package.json
COPY package-lock.json package-lock.json

# Install dependencies with retry logic
RUN npm install \
    --fetch-retries 5 \
    --fetch-timeout 600000 \
    --fetch-retry-maxtimeout 120000

# Copy source code and configurations
COPY . .

# Generate Prisma clients for both schemas
RUN npx prisma generate --schema=./prisma-chat/schema.prisma
RUN npx prisma generate --schema=./prisma-users/schema.prisma

# Build TypeScript code
RUN npm run build

# Remove dev dependencies
RUN npm prune --production

# Stage 2: Production stage
FROM node:20-alpine3.22 AS runner

WORKDIR /app

# Copy built files and dependencies from builder
COPY --from=builder /builds/dist ./dist
COPY --from=builder /builds/node_modules ./node_modules
COPY --from=builder /builds/prisma-chat ./prisma-chat
COPY --from=builder /builds/prisma-users ./prisma-users
COPY --from=builder /builds/package.json ./package.json

# Copy generated Prisma clients if stored separately
COPY --from=builder /builds/generated ./generated

# Create non-root user for security
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001 && \
    chown -R nodejs:nodejs /app

# Switch to non-root user
USER nodejs

# Expose port
EXPOSE 5004

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:5004/health || exit 1

# Start the application
CMD ["npm", "start"]
