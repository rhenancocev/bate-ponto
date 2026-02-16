const schedule = require('node-schedule');
const agendamento = require('../funcoes/agendamento-bate-ponto');

async function restartSchedules(chatId, bot, horasaida) {
  // STOP
  Object.keys(schedule.scheduledJobs).forEach(jobName => {
    schedule.cancelJob(jobName);
  });

  await bot.sendMessage(chatId, "Schedules reiniciados automaticamente.");

  // START
  agendamento.cronActive(chatId, bot, true, horasaida);
}

module.exports = { restartSchedules };
