const actions = {
  mudar_senha: require('./actions/mudar-senha.action'),
  schedule: require('./actions/start-schedule-manual.action'),
  trabalhar: require('./actions/trabalhar.action'),
  folga: require('./actions/folga.action')
};

module.exports = async function tratarEstado(ctx, bot, estado, estadoUsuarios) {
  const chatId = ctx.chat.id;
  const texto = ctx.text?.trim();
  if (!texto) return;

  if (texto.startsWith('/')) {
    delete estadoUsuarios[chatId];
    return bot.sendMessage(chatId, "❌ Operação cancelada. Operacao comecou com / .");
  }

  if (Date.now() - estado.startedAt > 2 * 60 * 1000) {
    delete estadoUsuarios[chatId];
    return bot.sendMessage(chatId, "⏳ Tempo expirado. Inicie novamente o comando.");
  }

  const actionHandler = actions[estado.acao];

  if (!actionHandler) {
    delete estadoUsuarios[chatId];
    return;
  }
  await actionHandler(ctx, bot, estado, estadoUsuarios);
};