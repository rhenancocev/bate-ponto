FROM node:14.8-slim

RUN npm install

RUN PUPPETEER_PRODUCT=firefox npm install puppeteer
RUN chmod -R o+rwx node_modules/puppeteer/.local-firefox

RUN npm install dotenv

COPY package*.json .
COPY index.js .
COPY .env .

CMD [ "node", "index.js" ]