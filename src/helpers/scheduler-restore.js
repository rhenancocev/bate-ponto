const persistence = require('./scheduler-persistence');
const scheduleEngine = require('./schedule-engine');
const executaSeDiaUtil = require('./executa-se-dia-util');
const bate_ponto = require('../funcoes/bate-ponto');
const { cronActive } = require('../funcoes/agendamento-bate-ponto');

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

  console.log('[RESTORE] Tipo:', state.tipo || 'normal');

  const diaExecucao = new Date(state.dia);
  const now = new Date();

  let algumJobRestaurado = false;

  for (const [nome, horario] of Object.entries(state.horarios)) {

    const dataExecucao = buildDate(
      diaExecucao,
      horario.hour,
      horario.minute
    );

    // tolerância de 2 minutos
    if (dataExecucao.getTime() < now.getTime() - 120000) {
      console.log(`[RESTORE] Ignorado (já passou): ${nome}`);
      continue;
    }
    algumJobRestaurado = true;
    console.log('[RESTORE][AGENDADO]', nome, dataExecucao.toString());
    scheduleEngine.scheduleOnce(nome, dataExecucao, async () => {
      try {
        // modo normal respeita feriado
        if (!state.tipo || state.tipo === 'normal') {
          await executaSeDiaUtil(bot, chatId, async () => {
            await bot.sendMessage(chatId,`Restaurado → ${nome} ${horario.hour}:${String(horario.minute).padStart(2,'0')}`);
            await bate_ponto.aponta(chatId, bot);
          });
        } else {
          // stress / inter executam direto
          await bot.sendMessage(chatId,`Restaurado → ${nome} ${horario.hour}:${String(horario.minute).padStart(2,'0')}`);
          await bate_ponto.aponta(chatId, bot);
        }
      } catch (err) {
        console.error(`[RESTORE][ERRO][${nome}]`, err);
      }

    });
  }
  
  // nenhum job futuro → dia já acabou
  if (!algumJobRestaurado) {
    console.log('[RESTORE] Dia já finalizado. Criando próximo dia útil...');
    setTimeout(() => {
      cronActive(chatId, bot, 18, true);
    }, 5000);
  }
}

module.exports = { restaurar };
