const env = require('../../config');
const chat_id = env.CHAT_ID;

module.exports = async (ctx, bot, estadoUsuarios) => {

  const chatId = ctx.chat.id;
  const nome = ctx.from.first_name;

  if (chatId != chat_id) {
    return bot.sendMessage(chatId,`${nome}, você não está autorizado para utilizar o bot.`);
  }
  estadoUsuarios[chatId] = { acao: 'mudar_senha' };
  return bot.sendMessage(chatId, `🔐 ${nome}, foi solicitado a alteracão de senha. Digite a nova senha:`);
};
