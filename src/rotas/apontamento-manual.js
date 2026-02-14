module.exports = async (ctx, bot) => {
  const bate_ponto = require('../funcoes/bate-ponto');
  const env = require('../../config');
  const chatId = ctx.chat.id;
  const nome = ctx.from.first_name;
  var chat_id = env.CHAT_ID;

  if (chatId == chat_id) {
    await bot.sendMessage(chatId, nome + ", aguarde enquanto bato seu ponto...");

    try {
      await bate_ponto.aponta(chatId, bot);
    } catch (err) {
      console.error("Erro manual:", err);
      await bot.sendMessage(chatId, "Erro ao bater ponto.");
    }

  } else {
    await bot.sendMessage(chatId, nome + ", você não está autorizado para utilizar o bot.");
  }
};