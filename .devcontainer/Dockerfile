# Base: Node.js 20 LTS on Debian Bookworm (latest stable devcontainer image as of 2026-02)
FROM mcr.microsoft.com/devcontainers/javascript-node:20-bookworm

# Install GitHub CLI repository key and source
RUN curl -fsSL https://cli.github.com/packages/githubcli-archive-keyring.gpg \
        | dd of=/usr/share/keyrings/githubcli-archive-keyring.gpg \
    && chmod go+r /usr/share/keyrings/githubcli-archive-keyring.gpg \
    && echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/githubcli-archive-keyring.gpg] https://cli.github.com/packages stable main" \
        | tee /etc/apt/sources.list.d/github-cli.list > /dev/null

# Install SQLite CLI, native build tools for better-sqlite3, and GitHub CLI
RUN apt-get update && apt-get install -y --no-install-recommends \
        sqlite3 \
        python3 \
        make \
        g++ \
        gh \
    && rm -rf /var/lib/apt/lists/*

# Update npm to latest to avoid version-outdated notices
RUN npm install -g npm@latest

# Install Claude Code CLI globally (required by the anthropic.claude-code VS Code extension)
RUN npm install -g @anthropic-ai/claude-code
