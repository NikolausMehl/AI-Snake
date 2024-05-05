#!/bin/bash

# Clone the repository into a temporary directory
git clone https://github.com/NikolausMehl/AI-Snake.git /tmp/AI-Snake

# Copy the contents of the repository to the default NGINX directory
cp -a /tmp/AI-Snake/src/. /usr/share/nginx/html/

# Cleanup temporary directory
rm -rf /tmp/AI-Snake

# Start Nginx
nginx -g "daemon off;"
