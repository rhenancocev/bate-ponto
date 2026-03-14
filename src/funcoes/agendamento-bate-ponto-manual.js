const bate_ponto = require('./bate-ponto');
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

async function cronActiveManual(chatId, bot, horaentrada, minutoentrada, horasaida, minutosaida, entradaesaida) {

  // engine controla cancelamento
  scheduleEngine.cancelarJobsExistentes();

  setModo('manual');

  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  // ---------------- RANDOM ----------------

  const hora_entrada = horaentrada;
  const minuto_entrada = minutoentrada;
  const hora_saida = horasaida;
  const minuto_saida = minutosaida;

  await bot.sendMessage(chatId,
`DATA: ${today.toLocaleDateString('pt-BR')}

  Sua entrada vai ser ${hora_entrada}:${minuto_entrada}
  ${entradaesaida === "sim"
    ? `Sua saída vai ser ${hora_saida}:${minuto_saida}`
    : 'Sem horário de saída definido'}

STATUS: AGUARDANDO SCHEDULE (Modo Manual)`
  );

  // ---------------- DATAS ----------------
  const dataExecucao = buildDate(today, hora_entrada, minuto_entrada);
  const now = new Date();
  const entradaManual = dataExecucao > now ? dataExecucao : buildDate(tomorrow, hora_entrada, minuto_entrada);

  let saidaManual;
  if (horasaida !== undefined && minutosaida !== undefined) {
    const dataSaida = buildDate(today, hora_saida, minuto_saida);
    saidaManual = dataSaida > now ? dataSaida : buildDate(tomorrow, hora_saida, minuto_saida);
  }

  // ---------------- PERSISTÊNCIA ----------------
  if (entradaesaida === "sim") {
    persistence.salvar({
      tipo: 'manual',
      dia: today.toISOString(),
      horarios: {
        entrada_manual: { hour: hora_entrada, minute: minuto_entrada },
        saida_manual: { hour: hora_saida, minute: minuto_saida }
      }
    });
    console.log('[MANUAL] Estado salvo para restore');
  }

  // ---------------- JOBS ----------------

  scheduleEngine.scheduleOnce('entrada_manual', entradaManual, async () => {
    await bot.sendMessage(chatId, `Iniciando entrada ${hora_entrada}:${minuto_entrada}`);
    await bate_ponto.aponta(chatId, bot);
    if (entradaesaida === "nao") {
      await bot.sendMessage(chatId,'Schedule manual finalizado. Retornando ao modo normal em 30 segundos...');
      schedulerState.finalizarAgenda();
      setModo('normal');
      persistence.limpar();
      setTimeout(() => {
        cronActive(chatId, bot, 18, false);
      }, 30000);
    }
  });

  // ---------- ÚLTIMO JOB ----------
  if (entradaesaida === "sim" && horasaida !== undefined && minutosaida !== undefined) {
    scheduleEngine.scheduleOnce('saida_manual', saidaManual, async () => {
      await bot.sendMessage(chatId,`Iniciando saída manual ${hora_saida}:${minuto_saida}`);
      await bate_ponto.aponta(chatId, bot);
      await bot.sendMessage(chatId,'Schedule manual finalizado. Retornando ao modo normal em 30 segundos...');
      schedulerState.finalizarAgenda();
      setModo('normal');
      persistence.limpar();
      setTimeout(() => {
        cronActive(chatId, bot, 18, false);
      }, 30000);
    });
  }
}

module.exports = { cronActiveManual };