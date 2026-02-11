const schedule = require('node-schedule');
const bate_ponto = require('./bate-ponto');
const random = require('./random');

function cronActive(ctx, bot, reinicia_processo, horasaida) {
  const timeElapsed = Date.now();
  const today = new Date(timeElapsed);
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
  minuto_saida = (cron_entrada + cron_saida) % 60;
    }

  bot.sendMessage(chatId, 'DATA: ' + today.toLocaleDateString() + ' \n'
    + '\nSua entrada vai ser 9:' + cron_entrada
    + '\nSua entrada do almoço vai ser 12:' + cron_entrada_almoco
    + '\nSua saída do almoço vai ser 13:' + minuto_saida_almoco
    + '\nSua saída vai ser ' + hora_saida + ':' + minuto_saida
    + '\n\nSTATUS: AGUARDANDO SCHEDULE');

  try {
    schedule.scheduleJob('entrada', `${cron_entrada} 9 * * 1-5`, () => {
      bot.sendMessage(chatId, 'Iniciando cronJOB para bater o ponto de entrada às 09:' + cron_entrada);
      bate_ponto.aponta(chatId, bot);
    });

    schedule.scheduleJob('almoco', `${cron_entrada_almoco} 12 * * 1-5`, () => {
      bot.sendMessage(chatId, 'Iniciando cronJOB para bater o ponto de entrada do almoço às 12:' + cron_entrada_almoco);
      bate_ponto.aponta(chatId, bot);
    });

    schedule.scheduleJob('volta_almoco', `${minuto_saida_almoco} 13 * * 1-5`, () => {
      bot.sendMessage(chatId, 'Iniciando cronJOB para bater o ponto de saída do almoço às 13:' + minuto_saida_almoco);
      bate_ponto.aponta(chatId, bot);
    });

    schedule.scheduleJob('saida', `${minuto_saida} ${hora_saida} * * 1-5`, async () => {
      bot.sendMessage(chatId, 'Iniciando cronJOB para bater o ponto de saída às ' + hora_saida + ':' + minuto_saida);
      bate_ponto.aponta(chatId, bot, reinicia_processo);
    });
  } catch (error) {
    bot.sendMessage(chatId, 'Erro ao agendar cron jobs: ' + error);
    console.error('Erro ao agendar cron jobs:', error);
  }
}

module.exports = {
  cronActive: cronActive
};
