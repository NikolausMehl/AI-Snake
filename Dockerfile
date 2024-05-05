FROM nginx:latest

# Install git
RUN apt-get update && apt-get install -y git

# Clone the repository into a temporary directory
RUN git clone https://github.com/NikolausMehl/AI-Snake.git /tmp/AI-Snake

# Copy the contents of the repository to the default NGINX directory
RUN cp -a /tmp/AI-Snake/. /usr/share/nginx/html/

# Cleanup temporary directory
RUN rm -rf /tmp/AI-Snake

# Expose port 80 for HTTP traffic
EXPOSE 80

# Run the Nginx web server in the background
CMD ["nginx", "-g", "daemon off;"]
