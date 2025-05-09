#!/bin/bash

# Export PATH to ensure npm is available
export PATH=$PATH:/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin

# Export NODE environment variables
export NODE_ENV=development

# Start the development server on port 5173 (Vite's default)
cd /home/saif/project\ 5
npm run dev:local