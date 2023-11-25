# bate-ponto

instalar:

PUPPETEER_PRODUCT=firefox npm install puppeteer
npm install env
npm install forever
npm install 


criar arquivo .env 

iniciar com o comando:

forever start --minUptime 1000 --spinSleepTime 1000 src/app-telegram.js

listar: forever list
parar: forever stopall
