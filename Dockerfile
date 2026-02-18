FROM node:20-slim

ENV PUPPETEER_SKIP_DOWNLOAD=true

# Define timezone
ENV TZ=America/Sao_Paulo

WORKDIR /app

# Instalar dependências + timezone data
RUN apt-get update && apt-get install -y \
    tzdata \
    chromium \
    libnss3 \
    libatk1.0-0 \
    libatk-bridge2.0-0 \
    libcups2 \
    libdrm2 \
    libxkbcommon0 \
    libxcomposite1 \
    libxdamage1 \
    libxrandr2 \
    libgbm1 \
    libgtk-3-0 \
    libasound2 \
    ca-certificates \
    fonts-liberation \
    --no-install-recommends \
    && ln -snf /usr/share/zoneinfo/$TZ /etc/localtime \
    && echo $TZ > /etc/timezone \
    && rm -rf /var/lib/apt/lists/*

COPY package.json ./
RUN npm install

COPY . .

CMD ["node", "src/app-telegram.js"]
