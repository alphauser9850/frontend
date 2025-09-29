#!/bin/bash

# Navigate to the project directory
cd "/home/saif/project 5"

# Build the app for production
echo "Building the app for production..."
/usr/bin/npm run build

# Install serve if not already installed
if ! command -v serve &> /dev/null; then
    echo "Installing serve package..."
    /usr/bin/npm install -g serve
fi

# Serve the built files with HTTPS on port 443
echo "Starting production server on port 443..."
/usr/bin/serve -s dist -l 443 --ssl-cert ./certs/cert.pem --ssl-key ./certs/key.pem 