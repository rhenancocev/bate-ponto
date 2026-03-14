const env = require('../../config');
const chat_id = env.CHAT_ID;

module.exports = async (ctx, bot, estadoUsuarios) => {

  const chatId = ctx.chat.id;
  const nome = ctx.from.first_name;

  if (chatId != chat_id) {
    return bot.sendMessage(chatId, `${nome}, você não está autorizado para utilizar o bot.`);
  }

  estadoUsuarios[chatId] = {
    acao: 'folga',
    step: 1,
    dados: {},
    startedAt: Date.now()
  };

  return bot.sendMessage(chatId,`📅 ${nome}, digite a data da folga.\nFormato: DD-MM-AAAA`);
};