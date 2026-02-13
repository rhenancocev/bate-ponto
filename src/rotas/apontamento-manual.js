module.exports = async (ctx, bot) => {
  const chatId = ctx.chat.id;
  const nome = ctx.from.first_name;

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