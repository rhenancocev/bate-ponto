const persistence = require('./scheduler-persistence');
const scheduleEngine = require('./schedule-engine');
const executaSeDiaUtil = require('./executa-se-dia-util');
const bate_ponto = require('../funcoes/bate-ponto');

function buildDate(baseDate, hour, minute) {
  const d = new Date(baseDate);
  d.setHours(hour, minute, 0, 0);
  return d;
}

async function restaurar(bot, chatId) {

  const state = persistence.carregar();

  if (!state) {
    console.log('[RESTORE] Nenhum estado salvo.');
    return;
  }

  console.log('[RESTORE] Tipo:', state.tipo);

  const diaExecucao = new Date(state.dia);
  const now = new Date();

  for (const [nome, horario] of Object.entries(state.horarios)) {

    const dataExecucao = buildDate(
      diaExecucao,
      horario.hour,
      horario.minute
    );

    // tolerância 2 minutos
    if (dataExecucao.getTime() < now.getTime() - 120000)
      continue;

    scheduleEngine.scheduleOnce(nome, dataExecucao, async () => {
      // normal usa verificação de feriado
      if (state.tipo === 'normal') {
        await executaSeDiaUtil(bot, chatId, async () => {
          await bot.sendMessage(chatId,`Restaurado → ${nome} ${horario.hour}:${horario.minute}`);
          await bate_ponto.aponta(chatId, bot);
        });
      } else {
        // stress/inter executam direto
        await bot.sendMessage(chatId,`Restaurado → ${nome} ${horario.hour}:${horario.minute}`);
        await bate_ponto.aponta(chatId, bot);
      }

    });
  }
}

module.exports = { restaurar };
