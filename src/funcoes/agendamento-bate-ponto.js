const bate_ponto = require('./bate-ponto');
const random = require('../helpers/random');
const executaSeDiaUtil = require('../helpers/executa-se-dia-util');
const getExecutionDay = require('../helpers/dia-execucao');
const formatarDataBR = require('../helpers/formatar-data');
const scheduleEngine = require('../helpers/schedule-engine');
const schedulerState = require('../helpers/scheduler-state');
const persistence = require('../helpers/scheduler-persistence');

function buildDate(baseDate, hour, minute) {
  const d = new Date(baseDate);
  d.setHours(hour, minute, 0, 0);
  return d;
}

async function cronActive(ctx, bot, horasaida, forceNextDay = false) {

  // evita duplicação
  if (schedulerState.isAgendaAtiva()) {
    console.log('[SCHEDULER] Agenda já ativa');
    return;
  }

  // engine controla cancelamento
  scheduleEngine.cancelarJobsExistentes();

  const today = new Date();
  let diaExecucao = getExecutionDay(today);

  if (forceNextDay) {
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    diaExecucao = getExecutionDay(tomorrow);
  }

  const chatId = ctx;
  // ---------------- RANDOMIZAÇÃO ----------------

  const min_entrada = 0;
  const max_entrada = 35;
  const min_saida = 50;
  const max_saida = 51;
  const min_almoco = 1;
  const max_almoco = 51;

  let hora_saida = horasaida;

  const cron_entrada = random.between(min_entrada, max_entrada);
  const cron_saida = random.between(min_saida, max_saida);
  let minuto_saida = cron_entrada + cron_saida;

  const cron_entrada_almoco = random.between(min_almoco, max_almoco);
  const minuto_saida_almoco = (cron_entrada_almoco + 62) % 60;

  if (minuto_saida >= 60) {
    hora_saida += 1;
    minuto_saida %= 60;
  }

  // ---------------- VALIDA SE DIA JÁ ACABOU ----------------

  const now = new Date();

  const dataSaidaTeste = buildDate(
    diaExecucao,
    hora_saida,
    minuto_saida
  );

  // se último horário já passou → mover dia inteiro
  if (dataSaidaTeste <= now) {
    console.log('[SCHEDULER] Dia já finalizado, movendo para próximo dia útil');

    const tomorrow = new Date(diaExecucao);
    tomorrow.setDate(tomorrow.getDate() + 1);

    diaExecucao = getExecutionDay(tomorrow);
  }

  // ---------------- PERSISTÊNCIA ----------------

  persistence.salvar({
    tipo: 'normal',
    dia: diaExecucao.toISOString(),
    horarios: {
      entrada: { hour: 9, minute: cron_entrada },
      almoco: { hour: 12, minute: cron_entrada_almoco },
      volta: { hour: 13, minute: minuto_saida_almoco },
      saida: { hour: hora_saida, minute: minuto_saida }
    }
  });

  // ---------------- MENSAGEM ----------------

  await bot.sendMessage(chatId,
`DATA DO PRÓXIMO PONTO: ${formatarDataBR(diaExecucao)}

  Sua entrada vai ser 9:${cron_entrada}
  Sua entrada do almoço vai ser 12:${cron_entrada_almoco}
  Sua saída do almoço vai ser 13:${minuto_saida_almoco}
  Sua saída vai ser ${hora_saida}:${minuto_saida}

STATUS: AGUARDANDO SCHEDULE`
  );

  console.log("AGORA:", now.toString());

  schedulerState.iniciarAgenda(diaExecucao.toDateString());

  try {

    // ---------- ENTRADA ----------
    const dataEntrada = buildDate(diaExecucao, 9, cron_entrada);

    scheduleEngine.scheduleOnce('entrada', dataEntrada, async () => {
      await executaSeDiaUtil(bot, chatId, async () => {
        await bot.sendMessage(chatId,`Iniciando entrada 09:${cron_entrada}`);
        await bate_ponto.aponta(chatId, bot);
      });
    });

    // ---------- ALMOÇO ----------
    const dataAlmoco = buildDate(diaExecucao, 12, cron_entrada_almoco);

    scheduleEngine.scheduleOnce('almoco', dataAlmoco, async () => {
      await executaSeDiaUtil(bot, chatId, async () => {
        await bot.sendMessage(chatId,`Iniciando almoço 12:${cron_entrada_almoco}`);
        await bate_ponto.aponta(chatId, bot);
      });
    });

    // ---------- VOLTA ----------
    const dataVolta = buildDate(diaExecucao, 13, minuto_saida_almoco);

    scheduleEngine.scheduleOnce('volta_almoco', dataVolta, async () => {
      await executaSeDiaUtil(bot, chatId, async () => {
        await bot.sendMessage(chatId,`Iniciando volta almoço 13:${minuto_saida_almoco}`);
        await bate_ponto.aponta(chatId, bot);
      });
    });

    // ---------- SAÍDA ----------
    const dataSaida = buildDate(diaExecucao, hora_saida, minuto_saida);

    scheduleEngine.scheduleOnce('saida', dataSaida, async () => {
      await executaSeDiaUtil(bot, chatId, async () => {
        await bot.sendMessage(chatId,`Iniciando saída ${hora_saida}:${minuto_saida}`);
        await bate_ponto.aponta(chatId, bot);
        await bot.sendMessage(chatId,"Dia finalizado. Gerando horários do próximo dia útil...");
        schedulerState.finalizarAgenda();
        persistence.limpar();
        setTimeout(() => {cronActive(chatId, bot, horasaida, true);}, 5000);
      });
    });

  } catch (error) {
    await bot.sendMessage(chatId,
      'Erro ao agendar cron jobs: ' + error);
    console.error('Erro ao agendar cron jobs:', error);
  }
}

module.exports = { cronActive };
