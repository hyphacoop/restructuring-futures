# Start from the Ubuntu image as a downloader
FROM ubuntu:20.04 as downloader

# Deno version you want to use
ARG VERSION=1.33.3

# Install dependencies
RUN apt update -y && \
    apt install -y unzip curl

# Download the Deno binary
RUN curl -Lsf https://github.com/LukeChannings/deno-arm64/releases/download/v${VERSION}/deno-linux-arm64.zip -o deno.zip

# Unzip and remove the downloaded zip file
RUN unzip deno.zip && rm deno.zip

# Start from a new Ubuntu image
FROM ubuntu:20.04

# Copy the Deno binary from the downloader stage
COPY --from=downloader /deno /bin/deno

# Add the deno group and user, and set the necessary permissions
RUN chmod 755 /bin/deno && \
    addgroup --gid 1993 deno && \
    adduser --uid 1993 --gid 1993 deno && \
    mkdir /deno-dir/ && \
    chown deno:deno /deno-dir/

# Set the necessary environment variables
ENV DENO_DIR /deno-dir/
ENV DENO_INSTALL_ROOT /usr/local

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