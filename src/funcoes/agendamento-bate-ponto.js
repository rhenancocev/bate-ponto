const schedule = require('node-schedule');
const bate_ponto = require('./bate-ponto');
const random = require('./random');

function cancelarJobsExistentes() {
  Object.values(schedule.scheduledJobs).forEach(job => job.cancel());
}

async function cronActive(ctx, bot, reinicia_processo, horasaida) {
  cancelarJobsExistentes();

  const today = new Date();
  const chatId = ctx;

  const min_entrada = 0;
  const max_entrada = 35;
  const min_saida = 50;
  const max_saida = 51;
  const min_almoco = 1;
  const max_almoco = 51;

  let hora_saida = horasaida;
  let cron_entrada = random.between(min_entrada, max_entrada);
  let cron_saida = random.between(min_saida, max_saida);
  let minuto_saida = cron_entrada + cron_saida;
  let cron_entrada_almoco = random.between(min_almoco, max_almoco);
  let minuto_saida_almoco = (cron_entrada_almoco + 62) % 60;

  if (minuto_saida >= 60) {
    hora_saida += 1;
    minuto_saida = minuto_saida % 60;
  }

  await bot.sendMessage(chatId,
    `DATA: ${today.toLocaleDateString()}

Sua entrada vai ser 9:${cron_entrada}
Sua entrada do almoço vai ser 12:${cron_entrada_almoco}
Sua saída do almoço vai ser 13:${minuto_saida_almoco}
Sua saída vai ser ${hora_saida}:${minuto_saida}

STATUS: AGUARDANDO SCHEDULE`
  );

  try {
    schedule.scheduleJob('entrada', {
      minute: cron_entrada,
      hour: 9,
      dayOfWeek: new schedule.Range(1, 5),
      tz: 'America/Sao_Paulo'
    }, async () => {
      try {
        await bot.sendMessage(chatId, `Iniciando entrada 09:${cron_entrada}`);
        await bate_ponto.aponta(chatId, bot);
      } catch (err) {
        console.error("Erro no job entrada:", err);
      }
    });

    schedule.scheduleJob('almoco', {
      minute: cron_entrada_almoco,
      hour: 12,
      dayOfWeek: new schedule.Range(1, 5),
      tz: 'America/Sao_Paulo'
    }, async () => {
      try {
        await bot.sendMessage(chatId, `Iniciando almoço 12:${cron_entrada_almoco}`);
        await bate_ponto.aponta(chatId, bot);
      } catch (err) {
        console.error("Erro no job almoço:", err);
      }
    });

    schedule.scheduleJob('volta_almoco', {
      minute: minuto_saida_almoco,
      hour: 13,
      dayOfWeek: new schedule.Range(1, 5),
      tz: 'America/Sao_Paulo'
    }, async () => {
      try {
        await bot.sendMessage(chatId, `Iniciando volta almoço 13:${minuto_saida_almoco}`);
        await bate_ponto.aponta(chatId, bot);
      } catch (err) {
        console.error("Erro no job volta almoço:", err);
      }
    });

    schedule.scheduleJob('saida', {
      minute: minuto_saida,
      hour: hora_saida,
      dayOfWeek: new schedule.Range(1, 5),
      tz: 'America/Sao_Paulo'
    }, async () => {
      try {
        await bot.sendMessage(chatId, `Iniciando saída ${hora_saida}:${minuto_saida}`);
        await bate_ponto.aponta(chatId, bot, reinicia_processo);
      } catch (err) {
        console.error("Erro no job saída:", err);
      }
    });

  } catch (error) {
    await bot.sendMessage(chatId, 'Erro ao agendar cron jobs: ' + error);
    console.error('Erro ao agendar cron jobs:', error);
  }
}

module.exports = {
  cronActive
};
