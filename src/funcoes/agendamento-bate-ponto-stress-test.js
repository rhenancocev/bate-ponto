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

  // se já existir agenda → limpa tudo
  if (schedulerState.isAgendaAtiva()) {
    console.log('[STRESS] Cancelando agenda atual para iniciar stress...');
    scheduleEngine.cancelarJobsExistentes();
    schedulerState.finalizarAgenda();
    persistence.limpar();
  }

  schedulerState.setModo('stress');

  const chatId = ctx;

  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  await bot.sendMessage(chatId,
`DATA: ${today.toLocaleDateString('pt-BR')}

  Os preparativos vai ser as 23:30
  O termino dos preparativos vai ser as 23:59
  Sua entrada vai ser 00:01
  Sua entrada do almoço vai ser 05:00
  Sua saída do almoço vai ser 06:01
  Sua saída vai ser 06:48

STATUS: AGUARDANDO SCHEDULE - Stress Test Ativo`
  );

  const jobs = [
    { name: 'prep_inicio', base: today, hour: 23, minute: 30 },
    { name: 'prep_fim', base: today, hour: 23, minute: 59 },
    { name: 'entrada', base: tomorrow, hour: 0, minute: 1 },
    { name: 'almoco', base: tomorrow, hour: 5, minute: 0 },
    { name: 'volta_almoco', base: tomorrow, hour: 6, minute: 1 },
    { name: 'saida', base: tomorrow, hour: 6, minute: 48 }
  ];

  // ---------- PERSISTÊNCIA ----------
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

  // ---------- AGENDAMENTO ----------
  jobs.forEach(job => {
    const dataExecucao = buildDate(job.base, job.hour, job.minute);

    // proteção extra (nunca agenda passado)
    if (dataExecucao <= new Date()) {
      console.log(`[STRESS] Ignorado (passado): ${job.name}`);
      return;
    }
    console.log(`[STRESS][AGENDADO] ${job.name}`,dataExecucao.toString());

    scheduleEngine.scheduleOnce(job.name, dataExecucao, async () => {
      await bot.sendMessage(chatId, `Executando ${job.name}`);
      await bate_ponto.aponta(chatId, bot);

      // ---------- ÚLTIMO JOB ----------
      if (job.name === 'saida') {
        await bot.sendMessage(chatId,'Stress Test finalizado. Operação normal voltará em 14 horas.');

        schedulerState.finalizarAgenda();
        schedulerState.setModo('normal');
        persistence.limpar();

        const dataRetorno = new Date(Date.now() + 14 * 60 * 60 * 1000);
        console.log('[STRESS] retorno agendado para:', dataRetorno);

        scheduleEngine.scheduleOnce('retorno_normal',dataRetorno,() => cronActive(chatId, bot, 18, true));
      }
    });
  });
}

module.exports = { cronActiveStressTest };