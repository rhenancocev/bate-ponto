const bate_ponto = require('./bate-ponto');
const random = require('../helpers/random');
const { setModo } = require('../helpers/scheduler-state');
const scheduleEngine = require('../helpers/schedule-engine');
const schedulerState = require('../helpers/scheduler-state');
const persistence = require('../helpers/scheduler-persistence');

const { cronActive } = require('./agendamento-bate-ponto');

function buildDate(baseDate, hour, minute) {
  const d = new Date(baseDate);
  d.setHours(hour, minute, 0, 0);
  return d;
}

async function cronActiveInter(ctx, bot) {

  // engine controla cancelamento
  scheduleEngine.cancelarJobsExistentes();

  setModo('inter');

  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const chatId = ctx;

  // ---------------- RANDOM ----------------

  const cron_entrada = random.between(30, 35);
  const cron_inter = 1;
  const minuto_saida = random.between(58, 59);
  const minuto_saida_inter = random.between(7, 21);

  await bot.sendMessage(chatId,
`DATA: ${today.toLocaleDateString('pt-BR')}

Sua entrada vai ser 23:${cron_entrada}
Sua saída da inter vai ser 23:${minuto_saida}
Sua entrada da inter vai ser 00:${cron_inter}
Sua saída vai ser 00:${minuto_saida_inter}

STATUS: AGUARDANDO SCHEDULE (Modo Inter)`
  );

  // ---------------- DATAS ----------------

  const entrada23 = buildDate(today, 23, cron_entrada);
  const saida23 = buildDate(today, 23, minuto_saida);

  const entradaInter = buildDate(tomorrow, 0, cron_inter);
  const saidaInter = buildDate(tomorrow, 0, minuto_saida_inter);

  // ---------------- PERSISTÊNCIA ----------------

  persistence.salvar({
    tipo: 'inter',
    dia: today.toISOString(),
    horarios: {
      entrada_23: { hour: 23, minute: cron_entrada },
      saida_geral: { hour: 23, minute: minuto_saida },
      entrada_inter: { hour: 0, minute: cron_inter },
      saida_inter: { hour: 0, minute: minuto_saida_inter }
    }
  });

  console.log('[INTER] Estado salvo para restore');

  // ---------------- JOBS ----------------

  scheduleEngine.scheduleOnce('entrada_23', entrada23, async () => {
    await bot.sendMessage(chatId, `Iniciando entrada 23:${cron_entrada}`);
    await bate_ponto.aponta(chatId, bot);
  });

  scheduleEngine.scheduleOnce('saida_geral', saida23, async () => {
    await bot.sendMessage(chatId, `Iniciando saída 23:${minuto_saida}`);
    await bate_ponto.aponta(chatId, bot);
  });

  scheduleEngine.scheduleOnce('entrada_inter', entradaInter, async () => {
    await bot.sendMessage(chatId, `Iniciando entrada inter 00:${cron_inter}`);
    await bate_ponto.aponta(chatId, bot);
  });

  // ---------- ÚLTIMO JOB ----------

  scheduleEngine.scheduleOnce('saida_inter', saidaInter, async () => {
    await bot.sendMessage(chatId,`Iniciando saída inter 00:${minuto_saida_inter}`);
    await bate_ponto.aponta(chatId, bot);
    await bot.sendMessage(chatId,'Turno madrugada finalizado. Retornando ao modo normal em 30 segundos...');
    schedulerState.finalizarAgenda();
    setModo('normal');
    persistence.limpar();
    setTimeout(() => {
      cronActive(chatId, bot, 18, false);
    }, 30000);
  });
}

module.exports = { cronActiveInter };