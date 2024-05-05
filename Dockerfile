FROM nginx:latest

# Install git
RUN apt-get update && apt-get install -y git

# Copy the entrypoint script into the container
COPY entrypoint.sh /entrypoint.sh

# Make the entrypoint script executable
RUN chmod +x /entrypoint.sh

# Expose port 80 for HTTP traffic
EXPOSE 80

# Set the entrypoint
ENTRYPOINT ["/entrypoint.sh"]
