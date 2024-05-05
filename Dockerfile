FROM nginx:latest

# Install git
RUN apt-get update && apt-get install -y git

# Clone the repository
RUN git clone https://github.com/NikolausMehl/AI-Snake.git /usr/share/nginx/html/

# Set the default root directory for the website
WORKDIR /usr/share/nginx/html/

# Expose port 80 for HTTP traffic
EXPOSE 80

# Run the Nginx web server in the background
CMD ["nginx", "-g", "daemon off;"]