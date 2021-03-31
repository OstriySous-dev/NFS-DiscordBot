# Start from a base image which includes Deno (https://github.com/hayd/deno-docker)
FROM hayd/deno:latest

# Create and move into /bot directory
WORKDIR /bot

# Copy the source code
COPY . .

# Chown the directory and its content so that it belong to Deno user
RUN chown -R deno:deno /bot

# Use user deno so the bot isn't running as root
USER deno

# Cache all of the dependencies so they don't need to be downloaded every run
RUN cp /bot/configs.example.ts /bot/configs.ts && \
    deno cache --unstable deps.ts && \
    deno cache --unstable mod.ts

# Finally run the bot
CMD ["run", "--allow-net", "--allow-read=/bot", "--allow-write=/bot", "--allow-env", "--allow-plugin", "--unstable", "./mod.ts"]
