const env = require('../../config');
const TelegramBot = require('node-telegram-bot-api');

const bot = new TelegramBot(env.TOKEN, {
  polling: {
    autoStart: true,
    interval: 300,
    params: {
      timeout: 10
    }
  }
});

module.exports = bot;