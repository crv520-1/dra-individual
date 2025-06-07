FROM node:20-slim

# Install dependencies for Puppeteer to run headless Chrome
# This list is a common set for Debian-based systems (like -slim)
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
    libnss3 \
    libatk1.0-0 \
    libatk-bridge2.0-0 \
    libcups2 \
    libdrm2 \
    libxkbcommon0 \
    libxcomposite1 \
    libxdamage1 \
    libxfixes3 \
    libxrandr2 \
    libgbm1 \
    libpango-1.0-0 \
    libcairo2 \
    libasound2 \
    # Clean up
    && apt-get clean && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy package.json and package-lock.json (if available)
COPY package*.json ./

# Install dependencies (including puppeteer, which will download its own Chromium)
RUN npm install

# Copy the rest of the application code
COPY . .

# Make the entrypoint script executable
RUN chmod +x /app/entrypoint.sh

# Expose the port the backend will run on
EXPOSE 3000

# Set the entrypoint script
ENTRYPOINT ["/app/entrypoint.sh"]

# Command to start the backend server (passed to entrypoint)
CMD ["node", "server.js"]