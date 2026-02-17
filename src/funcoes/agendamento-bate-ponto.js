const schedule = require('node-schedule');
const bate_ponto = require('./bate-ponto');
const random = require('./random');
const executaSeDiaUtil = require('../helpers/executa-se-dia-util');
const getExecutionDay = require('../helpers/dia-execucao');
const formatarDataBR = require('../helpers/formatar-data');



function cancelarJobsExistentes() {
  Object.values(schedule.scheduledJobs).forEach(job => job.cancel());
}

async function cronActive(ctx, bot, reinicia_processo, horasaida) {
  if (Object.keys(schedule.scheduledJobs).length > 0) {
    cancelarJobsExistentes();
  }

  const today = new Date(new Date().toLocaleString("en-US", {timeZone: "America/Sao_Paulo"}));
  const diaExecucao = getExecutionDay(today);
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
    `DATA DO PRÓXIMO PONTO: ${formatarDataBR(diaExecucao)}

    Sua entrada vai ser 9:${cron_entrada}
    Sua entrada do almoço vai ser 12:${cron_entrada_almoco}
    Sua saída do almoço vai ser 13:${minuto_saida_almoco}
    Sua saída vai ser ${hora_saida}:${minuto_saida}

    STATUS: AGUARDANDO SCHEDULE`
  );

  try {
    const dataEntrada = new Date(diaExecucao);
    dataEntrada.setHours(9, cron_entrada, 0, 0);

    schedule.scheduleJob('entrada', dataEntrada, async () => {
      console.log('[SCHEDULE][entrada] próxima execução:',schedule.scheduledJobs['entrada'].nextInvocation());
      try {
        await executaSeDiaUtil(bot, chatId, async () => {
          await bot.sendMessage(chatId, `Iniciando entrada 09:${cron_entrada}`);
          await bate_ponto.aponta(chatId, bot);
        });
      } catch (err) {
        console.error("Erro no job 1:", err);
      }
    });

    const dataAlmoco = new Date(diaExecucao);
    dataAlmoco.setHours(12, cron_entrada_almoco, 0, 0);

    schedule.scheduleJob('almoco', dataAlmoco, async () => {
      console.log('[SCHEDULE][almoco] próxima execução:',schedule.scheduledJobs['almoco'].nextInvocation());
      try {
        await executaSeDiaUtil(bot, chatId, async () => {
          await bot.sendMessage(chatId, `Iniciando almoço 12:${cron_entrada_almoco}`);
          await bate_ponto.aponta(chatId, bot);
        });
      } catch (err) {
        console.error("Erro no job 2:", err);
      }
    });

    const dataVoltaAlmoco = new Date(diaExecucao);
    dataVoltaAlmoco.setHours(13, minuto_saida_almoco, 0, 0);

    schedule.scheduleJob('volta_almoco', dataVoltaAlmoco, async () => {
      console.log('[SCHEDULE][volta_almoco] próxima execução:',schedule.scheduledJobs['volta_almoco'].nextInvocation());
      try {
        await executaSeDiaUtil(bot, chatId, async () => {
          await bot.sendMessage(chatId, `Iniciando volta almoço 13:${minuto_saida_almoco}`);
          await bate_ponto.aponta(chatId, bot);
        });
      } catch (err) {
        console.error("Erro no job 3:", err);
      }
    });

    const dataSaida = new Date(diaExecucao);
    dataSaida.setHours(hora_saida, minuto_saida, 0, 0);

    schedule.scheduleJob('saida', dataSaida, async () => {
      console.log('[SCHEDULE][saida] próxima execução:',schedule.scheduledJobs['saida'].nextInvocation());
      try {
        await executaSeDiaUtil(bot, chatId, async () => {
          await bot.sendMessage(chatId, `Iniciando saída ${hora_saida}:${minuto_saida}`);
          await bate_ponto.aponta(chatId, bot, reinicia_processo);
        });
      } catch (err) {
        console.error("Erro no job 4:", err);
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
