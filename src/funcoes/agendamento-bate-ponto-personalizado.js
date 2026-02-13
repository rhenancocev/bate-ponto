const schedule = require('node-schedule');
const bate_ponto = require('./bate-ponto');
const random = require('./random');

function cancelarJobsExistentes() {
  Object.values(schedule.scheduledJobs).forEach(job => job.cancel());
}

async function cronActivePersonalizado(ctx, bot, reinicia_processo) {
  cancelarJobsExistentes();

  const today = new Date();
  const chatId = ctx;

  const cron_entrada = random.between(1, 1);
  const cron_entrada_almoco = random.between(17, 17);
  const minuto_saida = 59;
  const minuto_saida_almoco = (cron_entrada_almoco + 62) % 60;
  const hora_saida = 17;

  await bot.sendMessage(chatId,
    `DATA: ${today.toLocaleDateString()}

Sua entrada vai ser 8:${cron_entrada}
Sua entrada do almoço vai ser 12:${cron_entrada_almoco}
Sua saída do almoço vai ser 13:${minuto_saida_almoco}
Sua saída vai ser ${hora_saida}:${minuto_saida}

STATUS: AGUARDANDO SCHEDULE`
  );

  const regraBase = {
    dayOfWeek: new schedule.Range(1, 5),
    tz: 'America/Sao_Paulo'
  };

  schedule.scheduleJob('entrada_personal', {
    ...regraBase, minute: cron_entrada, hour: 8
  }, async () => {
    try {
      await bot.sendMessage(chatId, `Iniciando entrada 8:${cron_entrada}`);
      await bate_ponto.aponta(chatId, bot);
    } catch (err) {
      console.error("Erro entrada_personal:", err);
    }
  });

  schedule.scheduleJob('almoco_personal', {
    ...regraBase, minute: cron_entrada_almoco, hour: 12
  }, async () => {
    try {
      await bot.sendMessage(chatId, `Iniciando almoço 12:${cron_entrada_almoco}`);
      await bate_ponto.aponta(chatId, bot);
    } catch (err) {
      console.error("Erro almoco_personal:", err);
    }
  });

  schedule.scheduleJob('volta_almoco_personal', {
    ...regraBase, minute: minuto_saida_almoco, hour: 13
  }, async () => {
    try {
      await bot.sendMessage(chatId, `Iniciando volta almoço 13:${minuto_saida_almoco}`);
      await bate_ponto.aponta(chatId, bot);
    } catch (err) {
      console.error("Erro volta_almoco_personal:", err);
    }
  });

  schedule.scheduleJob('saida_personal', {
    ...regraBase, minute: minuto_saida, hour: hora_saida
  }, async () => {
    try {
      await bot.sendMessage(chatId, `Iniciando saída ${hora_saida}:${minuto_saida}`);
      await bate_ponto.aponta(chatId, bot, reinicia_processo);
    } catch (err) {
      console.error("Erro saida_personal:", err);
    }
  });
}

module.exports = { cronActivePersonalizado };
