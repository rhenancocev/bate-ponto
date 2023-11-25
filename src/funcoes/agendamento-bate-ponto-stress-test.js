const schedule = require('node-schedule');
const bate_ponto = require('./bate-ponto')
const random = require('./random')

function cronActiveStressTest (ctx,bot,reinicia_processo){

    const timeElapsed = Date.now();
    const today = new Date(timeElapsed);
    const chatId = ctx;
    const min_entrada = 1;
    const max_entrada = 1;
    const min_almoco = 0;
    const max_almoco = 17;
    var hora_saida = 9;
    var cron_entrada = random.between(min_entrada,max_entrada);
    var minuto_saida = 51;
    var cron_entrada_almoco = random.between(min_almoco,max_almoco);
    var minuto_saida_almoco = (cron_entrada_almoco + 62) % 60;
    var minuto_inicio_preparativos = 0
    var minuto_fim_preparativos = 59

        bot.sendMessage(chatId, 'DATA: ' + today.toLocaleDateString() + ' \n'
                        + '\nOs preparativos vai ser as 23:00'
                        + '\nO termino dos preparativos vai ser as 23:59'
                        + '\nSua entrada vai ser 0:' + cron_entrada
                        + '\nSua entrada do almoço vai ser 7:'+ cron_entrada_almoco
                        + '\nSua saida do almoço vai ser 8:'+ minuto_saida_almoco
                        + '\nSua saida vai ser '+ hora_saida + ':' + minuto_saida
                        + '\n\nSTATUS: AGUARDANDO SCHEDULE');

        const entrada_preparativos = schedule.scheduleJob('entrada_preparativos', minuto_inicio_preparativos + ' 23 * * 1-5', () => {
            bot.sendMessage(chatId, 'Iniciando cronJOB para bater o ponto de entrada as 23:' + minuto_inicio_preparativos)
            bate_ponto.aponta(chatId,bot);
        }, null, true, 'America/Sao_Paulo')

        const fim_preparativos = schedule.scheduleJob('fim_preparativos', minuto_fim_preparativos + ' 23 * * 1-5', () => {
            bot.sendMessage(chatId, 'Iniciando cronJOB para bater o ponto de entrada as 23:' + minuto_fim_preparativos)
            bate_ponto.aponta(chatId,bot);
        }, null, true, 'America/Sao_Paulo')
    
        const entrada = schedule.scheduleJob('entrada', cron_entrada + ' 0 * * 1-5', () => {
            bot.sendMessage(chatId, 'Iniciando cronJOB para bater o ponto de entrada as 00:' + cron_entrada)
            bate_ponto.aponta(chatId,bot);
        }, null, true, 'America/Sao_Paulo')
    
        const almoco = schedule.scheduleJob('almoco', cron_entrada_almoco + ' 7 * * 1-5', () => {
            bot.sendMessage(chatId, 'Iniciando cronJOB para bater o ponto de entrada do almoço as 7:' + cron_entrada_almoco)
            bate_ponto.aponta(chatId,bot);
        }, null, true, 'America/Sao_Paulo')
    
        const volta_almoco = schedule.scheduleJob('volta_almoco', minuto_saida_almoco + ' 8 * * 1-5', () => {
            bot.sendMessage(chatId, 'Iniciando cronJOB para bater o ponto de saida do almoço as 8:' + minuto_saida_almoco)
            bate_ponto.aponta(chatId,bot);
        }, null, true, 'America/Sao_Paulo')

        const saida = schedule.scheduleJob('saida', minuto_saida + ' 9 * * 1-5', () => {
            bot.sendMessage(chatId, 'Iniciando cronJOB para bater o ponto de saida as 9:' + minuto_saida)
            bate_ponto.aponta(chatId,bot);
        }, null, true, 'America/Sao_Paulo')
    
}

module.exports = {
    cronActiveStressTest: cronActiveStressTest
}