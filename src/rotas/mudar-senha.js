const env = require('../../config');
const senha = require('../funcoes/mudar-senha');

const chat_id = env.CHAT_ID;

module.exports = async (ctx, bot) => {

  const chatId = ctx.chat.id;
  const nome = ctx.from.first_name;

  if (chatId != chat_id) {
    return bot.sendMessage(chatId,`${nome}, você não está autorizado para utilizar o bot.`);
  }
  await bot.sendMessage(chatId,`${nome}, foi solicitado a alteracão de senha. Iniciando processo...`);
  await senha.updatePassword(ctx, bot);
};
