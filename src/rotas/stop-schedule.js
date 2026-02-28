const schedule = require('node-schedule');
const env = require('../../config');
const chat_id = env.CHAT_ID;

module.exports = async (ctx, bot) => {
  const chatId = ctx.chat.id;
  const nome = ctx.from.first_name;

  if (chatId == chat_id) {
    await bot.sendMessage(chatId,`${nome}, foi solicitado o cancelamento de TODOS os schedules.`);
    const jobs = schedule.scheduledJobs;
    const total = Object.keys(jobs).length;

    Object.keys(jobs).forEach(jobName => {
      schedule.cancelJob(jobName);
    });
    
    await bot.sendMessage(chatId,`${total} schedule(s) cancelado(s) com sucesso.`);
  } else {
    bot.sendMessage(chatId,`${nome}, você não está autorizado para utilizar o bot.`);
  }
};