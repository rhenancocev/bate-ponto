const bate_ponto = require('./bate-ponto');
const scheduleEngine = require('../helpers/schedule-engine');
const schedulerState = require('../helpers/scheduler-state');
const persistence = require('../helpers/scheduler-persistence');
const { cronActive } = require('./agendamento-bate-ponto'); // normal

function buildDate(baseDate, hour, minute) {
  const d = new Date(baseDate);
  d.setHours(hour, minute, 0, 0);
  return d;
}

async function cronActiveStressTest(ctx, bot) {
  // evita iniciar se já existir agenda
if (schedulerState.isAgendaAtiva()) {
  console.log('[STRESS] Cancelando agenda atual para iniciar stress...');
  scheduleEngine.cancelarJobsExistentes();
  schedulerState.finalizarAgenda();
  persistence.limpar();
}

  scheduleEngine.cancelarJobsExistentes();

  schedulerState.setModo('stress');

  const today = new Date();
  const chatId = ctx;

  await bot.sendMessage(chatId,
`DATA: ${today.toLocaleDateString('pt-BR')}

  Os preparativos vai ser as 23:30
  O termino dos preparativos vai ser as 23:59
  Sua entrada vai ser 00:01
  Sua entrada do almoço vai ser 5:00
  Sua saída do almoço vai ser 6:01
  Sua saída vai ser 06:48

STATUS: AGUARDANDO SCHEDULE - Stress Test Ativo`
  );

  const jobs = [
    { name: 'prep_inicio', hour: 23, minute: 30 },
    { name: 'prep_fim', hour: 23, minute: 59 },
    { name: 'entrada', hour: 0, minute: 1 },
    { name: 'almoco', hour: 5, minute: 0 },
    { name: 'volta_almoco', hour: 6, minute: 1 },
    { name: 'saida', hour: 6, minute: 48 }
  ];

  // salva estado para recovery
  persistence.salvar({
    tipo: 'stress',
    dia: today.toISOString(),
    horarios: Object.fromEntries(
      jobs.map(j => [
        j.name,
        { hour: j.hour, minute: j.minute }
      ])
    )
  });

  schedulerState.iniciarAgenda(today.toDateString());

  jobs.forEach(job => {
    const dataExecucao = buildDate(today, job.hour, job.minute);
    console.log(`[STRESS][AGENDADO] ${job.name}`, dataExecucao.toString());

    scheduleEngine.scheduleOnce(job.name, dataExecucao, async () => {
      await bot.sendMessage(chatId, `Executando ${job.name}`);
      await bate_ponto.aponta(chatId, bot);

      // último job
      if (job.name === 'saida') {
        await bot.sendMessage(chatId,'Stress Test finalizado. Operação normal voltará em 13 horas.');

        schedulerState.finalizarAgenda();
        schedulerState.setModo('normal');
        persistence.limpar();

        const dataRetorno = new Date();
        dataRetorno.setHours(dataRetorno.getHours() + 13);
        console.log('[STRESS] retorno agendado para:', dataRetorno);

        scheduleEngine.scheduleOnce('retorno_normal', dataRetorno, () => cronActive(chatId, bot, 18, true));
      }
    });
  });
}

module.exports = { cronActiveStressTest };
