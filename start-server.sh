#!/bin/bash

# Navigate to the project directory
cd "/var/www/berkut-cloud"

# Build the project if not already built
echo "Building SSR app..."
npm run build

# Start the SSR server
echo "Starting SSR server on port 3000..."
node ./dist/server/entry-server.js
