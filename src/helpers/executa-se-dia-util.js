const feriados = require('./feriados');

module.exports = async function executaSeDiaUtil(bot, chatId, fn) {
  if (feriados.isFeriado()) {
    const nome = feriados.nomeFeriado();
    await bot.sendMessage(chatId,`Hoje é feriado (${nome}). Nenhum ponto será executado.`);
    return;
  }
  await fn();
};
