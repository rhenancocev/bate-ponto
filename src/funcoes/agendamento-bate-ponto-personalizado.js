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
    
        const entrada = schedule.scheduleJob('entrada', cron_entrada + ' 8 * * 1-5', () => {
            bot.sendMessage(chatId, 'Iniciando cronJOB para bater o ponto de entrada as 8:' + cron_entrada)
            bate_ponto.aponta(chatId,bot);
        }, null, true, 'America/Sao_Paulo')
    
        const almoco = schedule.scheduleJob('almoco', cron_entrada_almoco + ' 12 * * 1-5', () => {
            bot.sendMessage(chatId, 'Iniciando cronJOB para bater o ponto de entrada do almoço as 12:' + cron_entrada_almoco)
            bate_ponto.aponta(chatId,bot);
        }, null, true, 'America/Sao_Paulo')
    
        const volta_almoco = schedule.scheduleJob('volta_almoco', minuto_saida_almoco + ' 13 * * 1-5', () => {
            bot.sendMessage(chatId, 'Iniciando cronJOB para bater o ponto de saida do almoço as 13:' + minuto_saida_almoco)
            bate_ponto.aponta(chatId,bot);
        }, null, true, 'America/Sao_Paulo')
    
        const saida = schedule.scheduleJob('saida', minuto_saida + ' ' + hora_saida + ' * * 1-5', async () => {
            bot.sendMessage(chatId, 'Iniciando cronJOB para bater o ponto de saida as ' + hora_saida + ':' + minuto_saida)
            bate_ponto.aponta(chatId,bot,reinicia_processo);
        }, null, true, 'America/Sao_Paulo')
}

module.exports = {
    cronActivePersonalizado: cronActivePersonalizado
}