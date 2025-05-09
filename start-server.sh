#!/bin/bash

# Navigate to the project directory
cd "/var/www/berkut-cloud"

# Serve the built files on the specified port
echo "Starting server on port 3000..."
/usr/bin/serve -s dist -l 3000
