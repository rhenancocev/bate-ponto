const env = require('../../config');
const chat_id = env.CHAT_ID;

module.exports = async (ctx, bot) => {
  const chatId = ctx.chat.id;
  const nome = ctx.from.first_name;

  if (chatId == chat_id) {
    await bot.sendMessage(chatId, `${nome}, a aplicação foi reiniciada!`);
    process.exit(0);
  } else {
    bot.sendMessage(chatId, `${nome}, você não está autorizado para utilizar o bot.`);
  }
};