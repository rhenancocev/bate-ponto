const schedule = require('node-schedule');
const bate_ponto = require('./bate-ponto')
const random = require('./random')

function cronActivePersonalizado (ctx,bot,reinicia_processo){

  const timeElapsed = Date.now();
  const today = new Date(timeElapsed);
  const chatId = ctx;
  const min_entrada = 1;
  const max_entrada = 1;
  const min_almoco = 17;
  const max_almoco = 17;
  var hora_saida = 17;
  var cron_entrada = random.between(min_entrada,max_entrada);
  var minuto_saida = 59
  var cron_entrada_almoco = random.between(min_almoco,max_almoco);
  var minuto_saida_almoco = (cron_entrada_almoco + 62) % 60;

  bot.sendMessage(chatId, 'DATA: ' + today.toLocaleDateString() + ' \n'
                  + '\nSua entrada vai ser 8:' + cron_entrada
                  + '\nSua entrada do almoço vai ser 12:'+ cron_entrada_almoco
                  + '\nSua saida do almoço vai ser 13:'+ minuto_saida_almoco
                  + '\nSua saida vai ser '+ hora_saida + ':' + minuto_saida
                  + '\n\nSTATUS: AGUARDANDO SCHEDULE');

  schedule.scheduleJob('entrada', {minute: cron_entrada, hour: 8, dayOfWeek: new schedule.Range(1, 5), tz: 'America/Sao_Paulo'}, () => {
    bot.sendMessage(chatId, 'Iniciando cronJOB para bater o ponto de entrada às 09:' + cron_entrada);
    bate_ponto.aponta(chatId, bot);
  });

  schedule.scheduleJob('almoco', {minute: cron_entrada_almoco, hour: 12, dayOfWeek: new schedule.Range(1, 5), tz: 'America/Sao_Paulo'}, () => {
    bot.sendMessage(chatId, 'Iniciando cronJOB para bater o ponto de entrada do almoço às 12:' + cron_entrada_almoco);
    bate_ponto.aponta(chatId, bot);
  });

  schedule.scheduleJob('volta_almoco', {minute: minuto_saida_almoco, hour: 13, dayOfWeek: new schedule.Range(1, 5), tz: 'America/Sao_Paulo'}, () => {
    bot.sendMessage(chatId, 'Iniciando cronJOB para bater o ponto de saída do almoço às 13:' + minuto_saida_almoco);
    bate_ponto.aponta(chatId, bot);
  });

  schedule.scheduleJob('saida', {minute: minuto_saida, hour: hora_saida, dayOfWeek: new schedule.Range(1, 5),tz: 'America/Sao_Paulo'}, async () => {
    bot.sendMessage(chatId, 'Iniciando cronJOB para bater o ponto de saída às ' + hora_saida + ':' + minuto_saida);
    bate_ponto.aponta(chatId, bot, reinicia_processo);
  });
}

module.exports = {
    cronActivePersonalizado: cronActivePersonalizado
}