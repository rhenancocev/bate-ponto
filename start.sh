#!/bin/sh

# Executa o aplicativo usando forever
forever start --minUptime 1000 --spinSleepTime 1000 src/app-telegram.js
#forever start --minUptime 1000 --spinSleepTime 1000 src/funcoes/teclando.js
