const schedule = require('node-schedule');
const bate_ponto = require('./bate-ponto')
const random = require('./random')

function cronActiveStressTest (ctx,bot,reinicia_processo){

    const timeElapsed = Date.now();
    const today = new Date(timeElapsed);
    const chatId = ctx;
    const min_entrada = 1;
    const max_entrada = 1;
    var hora_saida = 6;
    var cron_entrada = random.between(min_entrada,max_entrada);
    var minuto_saida = 48;
    var cron_entrada_almoco = 0
    var minuto_saida_almoco = 1 //(cron_entrada_almoco + 62) % 60;
    var minuto_inicio_preparativos = 0
    var minuto_fim_preparativos = 59

        bot.sendMessage(chatId, 'DATA: ' + today.toLocaleDateString() + ' \n'
                        + '\nOs preparativos vai ser as 23:00'
                        + '\nO termino dos preparativos vai ser as 23:59'
                        + '\nSua entrada vai ser 0:' + cron_entrada
                        + '\nSua entrada do almoço vai ser 5:'+ cron_entrada_almoco
                        + '\nSua saida do almoço vai ser 6:'+ minuto_saida_almoco
                        + '\nSua saida vai ser '+ hora_saida + ':' + minuto_saida
                        + '\n\nSTATUS: AGUARDANDO SCHEDULE');

        schedule.scheduleJob('entrada_preparativos', {minute: minuto_inicio_preparativos, hour: 23, dayOfWeek: new schedule.Range(1, 5), tz: 'America/Sao_Paulo'}, () => {
            bot.sendMessage(chatId,'Iniciando cronJOB para bater o ponto de entrada às 23:' + minuto_inicio_preparativos);
            bate_ponto.aponta(chatId, bot);
        });

        schedule.scheduleJob('fim_preparativos', {minute: minuto_fim_preparativos, hour: 23, dayOfWeek: new schedule.Range(1, 5), tz: 'America/Sao_Paulo'}, () => {
            bot.sendMessage(chatId, 'Iniciando cronJOB para bater o ponto de entrada as 23:' + minuto_fim_preparativos)
            bate_ponto.aponta(chatId,bot);
        });
    
        schedule.scheduleJob('entrada', {minute: cron_entrada, hour: 0, dayOfWeek: new schedule.Range(1, 5), tz: 'America/Sao_Paulo'}, () => {
            bot.sendMessage(chatId, 'Iniciando cronJOB para bater o ponto de entrada as 00:' + cron_entrada)
            bate_ponto.aponta(chatId,bot);
        });
    
        schedule.scheduleJob('almoco', {minute: cron_entrada_almoco, hour: 5, dayOfWeek: new schedule.Range(1, 5), tz: 'America/Sao_Paulo'}, () => {
            bot.sendMessage(chatId, 'Iniciando cronJOB para bater o ponto de entrada do almoço as 5:' + cron_entrada_almoco)
            bate_ponto.aponta(chatId,bot);
        });
    
        schedule.scheduleJob('volta_almoco', {minute: minuto_saida_almoco, hour: 6, dayOfWeek: new schedule.Range(1, 5), tz: 'America/Sao_Paulo'}, () => {
            bot.sendMessage(chatId, 'Iniciando cronJOB para bater o ponto de saida do almoço as 16:' + minuto_saida_almoco)
            bate_ponto.aponta(chatId,bot);
        });

        schedule.scheduleJob('saida', {minute: minuto_saida, hour: 6, dayOfWeek: new schedule.Range(1, 5), tz: 'America/Sao_Paulo'}, () => {
            bot.sendMessage(chatId, 'Iniciando cronJOB para bater o ponto de saida as 6:' + minuto_saida)
            bate_ponto.aponta(chatId,bot);
        });
    
}

module.exports = {
    cronActiveStressTest: cronActiveStressTest
}