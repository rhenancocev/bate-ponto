const env = require('../../config');
const schedulerState = require('../helpers/scheduler-state');
const persistence = require('../helpers/scheduler-persistence');
const agendamento = require('../funcoes/agendamento-bate-ponto');

const chat_id = env.CHAT_ID;

module.exports = async (ctx, bot) => {

  const chatId = ctx.chat.id;
  const nome = ctx.from.first_name;

  if (chatId != chat_id) {
    return bot.sendMessage(chatId,`${nome}, você não está autorizado para utilizar o bot.`);
  }

  await bot.sendMessage(chatId,`${nome}, foi solicitado o start de TODOS os schedules.`);

  schedulerState.finalizarAgenda();
  schedulerState.setModo('normal');
  persistence.limpar();
  
  await agendamento.cronActive(chat_id, bot, 18);
};
