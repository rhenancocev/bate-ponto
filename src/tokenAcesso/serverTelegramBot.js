const env = require('../../config');
const TelegramBot = require('node-telegram-bot-api');

const bot = new TelegramBot(env.TOKEN, {
  polling: {
    autoStart: true,
    interval: 1000,
    params: {
      timeout: 60
    }
  }
});

bot.on('polling_error', (err) => {
  if (err.code === 'EFATAL') return;
  console.error('[TELEGRAM]', err.message);
});

bot.on('error', (err) => {
  console.error('[TELEGRAM ERROR]', err.message);
});

module.exports = bot;