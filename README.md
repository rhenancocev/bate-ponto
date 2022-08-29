# bate-ponto

instalar:

PUPPETEER_PRODUCT=firefox npm install puppeteer
npm install dotenv
npm install
npm install forever


criar arquivo .env 

iniciar com o comando:

forever start --minUptime 1000 --spinSleepTime 1000 app-telegram.js

listar: forever list
parar: forever stopall
