const schedule = require('node-schedule');
const env = require('../../config');
const chat_id = env.CHAT_ID;

module.exports = async (ctx, bot) => {
  const chatId = ctx.chat.id;
  const nome = ctx.from.first_name;

  if (chatId == chat_id) {
    await bot.sendMessage(chatId, `${nome}, foi solicitado o cancelamento dos schedules!`);
    await schedule.gracefulShutdown();
    bot.sendMessage(chatId, 'Todos os schedules foram cancelados com sucesso.');
  } else {
    bot.sendMessage(chatId, `${nome}, você não está autorizado para utilizar o bot.`);
  }
};