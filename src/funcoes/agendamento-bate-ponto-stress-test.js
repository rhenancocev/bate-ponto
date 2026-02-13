const schedule = require('node-schedule');
const bate_ponto = require('./bate-ponto');

function cancelarJobsExistentes() {
  Object.values(schedule.scheduledJobs).forEach(job => job.cancel());
}

async function cronActiveStressTest(ctx, bot) {
  cancelarJobsExistentes();

  const today = new Date();
  const chatId = ctx;

  await bot.sendMessage(chatId,
    `DATA: ${today.toLocaleDateString()}
Stress Test Ativo`
  );

  const regraBase = {
    dayOfWeek: new schedule.Range(1, 5),
    tz: 'America/Sao_Paulo'
  };

  const jobs = [
    { name: 'prep_inicio', hour: 23, minute: 0 },
    { name: 'prep_fim', hour: 23, minute: 59 },
    { name: 'entrada', hour: 0, minute: 1 },
    { name: 'almoco', hour: 5, minute: 0 },
    { name: 'volta_almoco', hour: 6, minute: 1 },
    { name: 'saida', hour: 6, minute: 48 }
  ];

  jobs.forEach(job => {
    schedule.scheduleJob(job.name, {
      ...regraBase,
      hour: job.hour,
      minute: job.minute
    }, async () => {
      try {
        await bot.sendMessage(chatId, `Executando ${job.name}`);
        await bate_ponto.aponta(chatId, bot);
      } catch (err) {
        console.error(`Erro ${job.name}:`, err);
      }
    });
  });
}

module.exports = { cronActiveStressTest };
