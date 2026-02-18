const env = require('../../config');
const scheduleEngine = require('../helpers/schedule-engine');
const persistence = require('../helpers/scheduler-persistence');
const schedulerState = require('../helpers/scheduler-state');

const chat_id = env.CHAT_ID;

module.exports = async (ctx, bot) => {

  const chatId = ctx.chat.id;
  const nome = ctx.from.first_name;

  if (chatId != chat_id) {
    return bot.sendMessage(chatId,`${nome}, você não está autorizado para utilizar o bot.`);
  }

  await bot.sendMessage(chatId,`${nome}, foi solicitado o cancelamento de TODOS os schedules.`);

  // 1 — cancela todos os jobs ativos
  const total = scheduleEngine.cancelarJobsExistentes();

  // 2 — limpa estado salvo (impede restore)
  persistence.limpar();

  // 3 — volta modo para normal neutro
  schedulerState.setModo('normal');
  schedulerState.finalizarAgenda?.();

  await bot.sendMessage(chatId,`${total} schedule(s) cancelado(s) com sucesso.\nScheduler completamente parado.`);
};
