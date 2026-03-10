module.exports = async function tratarEstado(ctx, bot, estado, estadoUsuarios) {
  const chatId = ctx.chat.id;
  const texto = ctx.text.trim();
  const senha = require('../funcoes/mudar-senha');

  if (texto.startsWith('/')) {
    delete estadoUsuarios[chatId];
    return bot.sendMessage(chatId, "❌ Operação cancelada. Operacao comecou com /");
  }

  switch (estado.acao) {
    case 'mudar_senha':
      await senha.updatePassword(chatId, bot, texto);
      delete estadoUsuarios[chatId];
      return;
  }
};