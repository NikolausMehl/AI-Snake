FROM nginx:latest

# Copy the website contents to the container
COPY src /usr/share/nginx/html/

# Set the default root directory for the website
WORKDIR /usr/share/nginx/html/

# Expose port 80 for HTTP traffic
EXPOSE 80

# Run the Nginx web server in the background
CMD ["nginx", "-g", "daemon off;"]