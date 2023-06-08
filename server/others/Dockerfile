# Start from the Ubuntu image
FROM ubuntu:20.04

# Deno version you want to use
ARG VERSION=1.33.3

# Install dependencies
RUN apt-get update -y && \
    apt-get install -y unzip curl

# Download the Deno binary using the official install script
RUN curl -fsSL https://deno.land/x/install/install.sh | sh -s v${VERSION}

# Add the deno group and user, and set the necessary permissions
RUN addgroup --gid 1993 deno && \
    adduser --uid 1993 --gid 1993 deno && \
    mkdir /deno-dir/ && \
    chown deno:deno /deno-dir/

# Set the necessary environment variables
ENV DENO_DIR /deno-dir/
ENV DENO_INSTALL_ROOT /usr/local
# Make sure the deno binary is in the PATH
ENV PATH="/root/.deno/bin:$PATH"

# Set the working directory
WORKDIR /app

# Create the /app/data/ directory
RUN mkdir -p /app/data/ && chmod -R 777 /app/data/

# Set the /app/data/ directory as a volume
VOLUME [ "/app/data" ]

# Copy your server.ts and known_shares.json files
COPY server.ts ./server.ts
COPY known_shares.json ./known_shares.json

# Set the user for subsequent commands (and the running container) to root
USER root

# Set the entrypoint and default command
CMD ["deno", "run", "--allow-all", "server.ts"]

# Expose the necessary ports
EXPOSE 8000
EXPOSE 443
