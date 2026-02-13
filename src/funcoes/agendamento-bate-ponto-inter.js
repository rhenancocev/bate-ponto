const schedule = require('node-schedule');
const bate_ponto = require('./bate-ponto');
const random = require('./random');

function cancelarJobsExistentes() {
  Object.values(schedule.scheduledJobs).forEach(job => job.cancel());
}

async function cronActiveInter(ctx, bot, reinicia_processo) {
  cancelarJobsExistentes();

  const today = new Date();
  const chatId = ctx;

  const cron_entrada = random.between(30, 35);
  const cron_inter = random.between(1, 1);
  const minuto_saida = random.between(58, 59);
  const minuto_saida_inter = random.between(7, 21);
  const hora_saida = 23;

  await bot.sendMessage(chatId,
    `DATA: ${today.toLocaleDateString()}

Sua entrada vai ser 23:${cron_entrada}
Sua saída da inter vai ser 23:${minuto_saida}
Sua entrada da inter vai ser 00:${cron_inter}
Sua saída vai ser 00:${minuto_saida_inter}

STATUS: AGUARDANDO SCHEDULE`
  );

  const regraBase = {
    dayOfWeek: new schedule.Range(1, 5),
    tz: 'America/Sao_Paulo'
  };

  schedule.scheduleJob('entrada_23', {
    ...regraBase, minute: cron_entrada, hour: 23
  }, async () => {
    try {
      await bot.sendMessage(chatId, `Iniciando entrada 23:${cron_entrada}`);
      await bate_ponto.aponta(chatId, bot);
    } catch (err) {
      console.error("Erro entrada_23:", err);
    }
  });

  schedule.scheduleJob('saida_geral', {
    ...regraBase, minute: minuto_saida, hour: hora_saida
  }, async () => {
    try {
      await bot.sendMessage(chatId, `Iniciando saída 23:${minuto_saida}`);
      await bate_ponto.aponta(chatId, bot);
    } catch (err) {
      console.error("Erro saida_geral:", err);
    }
  });

  schedule.scheduleJob('entrada_inter', {
    ...regraBase, minute: cron_inter, hour: 0
  }, async () => {
    try {
      await bot.sendMessage(chatId, `Iniciando entrada inter 00:${cron_inter}`);
      await bate_ponto.aponta(chatId, bot);
    } catch (err) {
      console.error("Erro entrada_inter:", err);
    }
  });

  schedule.scheduleJob('saida_inter', {
    ...regraBase, minute: minuto_saida_inter, hour: 0
  }, async () => {
    try {
      await bot.sendMessage(chatId, `Iniciando saída inter 00:${minuto_saida_inter}`);
      await bate_ponto.aponta(chatId, bot, reinicia_processo);
    } catch (err) {
      console.error("Erro saida_inter:", err);
    }
  });
}

module.exports = { cronActiveInter };
