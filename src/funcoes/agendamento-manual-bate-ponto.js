const schedule = require('node-schedule');
const bate_ponto = require('./bate-ponto');

function cancelarJobsExistentes() {
  Object.values(schedule.scheduledJobs).forEach(job => job.cancel());
}

async function agendamentoCron(chatId, bot, reinicia_processo, hora, minuto) {
  cancelarJobsExistentes();

  await bot.sendMessage(chatId,
    `Agendamos schedule manual.
Seu ponto será batido às ${hora}:${minuto}`
  );

  schedule.scheduleJob('schedule_manual', {
    minute: minuto,
    hour: hora,
    dayOfWeek: new schedule.Range(0, 6),
    tz: 'America/Sao_Paulo'
  }, async () => {
    try {
      await bot.sendMessage(chatId, `Executando manual às ${hora}:${minuto}`);
      await bate_ponto.aponta(chatId, bot, reinicia_processo);
    } catch (err) {
      console.error("Erro manual:", err);
    }
  });
}

module.exports = { agendamentoCron };
