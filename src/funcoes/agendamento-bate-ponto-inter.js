const schedule = require('node-schedule');
const bate_ponto = require('./bate-ponto')
const random = require('./random')

function cronActiveInter (ctx,bot,reinicia_processo){

    const timeElapsed = Date.now();
    const today = new Date(timeElapsed);
    const chatId = ctx;
    const min_entrada = 30;
    const max_entrada = 35;
	const min_entrada_r = 1;
    const max_entrada_r = 1;
    const min_saida= 58;
    const max_saida = 59;
	const min_saida_r = 7;
    const max_saida_r = 21;
    var hora_saida = 23;
    var cron_entrada = random.between(min_entrada,max_entrada);
    var cron_inter = random.between(min_entrada_r,max_entrada_r);
    var minuto_saida = random.between(min_saida,max_saida);
    var minuto_saida_inter = random.between(min_saida_r,max_saida_r);

        bot.sendMessage(chatId, 'DATA: ' + today.toLocaleDateString() + ' \n'
                        + '\nSua entrada vai ser 23:' + cron_entrada
                        + '\nSua saida da inter vai ser 23:'+ minuto_saida
                        + '\nSua entrada da inter vai ser 00:'+ cron_inter
                        + '\nSua saida vai ser 00: '+ minuto_saida_inter
                        + '\n\nSTATUS: AGUARDANDO SCHEDULE');
    
        const entrada = schedule.scheduleJob('entrada', cron_entrada + ' 23 * * 1-5', () => {
            bot.sendMessage(chatId, 'Iniciando cronJOB para bater o ponto de entrada as 23:' + cron_entrada)
            bate_ponto.aponta(chatId,bot);
        }, null, true, 'America/Sao_Paulo')
    
        const saida = schedule.scheduleJob('saida', minuto_saida + ' ' + hora_saida + ' * * 1-5', async () => {
            bot.sendMessage(chatId, 'Iniciando cronJOB para bater o ponto de saida as ' + hora_saida + ':' + minuto_saida)
            bate_ponto.aponta(chatId,bot);
        }, null, true, 'America/Sao_Paulo')

        const entrada_inter = schedule.scheduleJob('entrada', cron_inter + ' 0 * * 1-5', () => {
            bot.sendMessage(chatId, 'Iniciando cronJOB para bater o ponto de entrada as 00:' + cron_inter)
            bate_ponto.aponta(chatId,bot);
        }, null, true, 'America/Sao_Paulo')
    
        const saida_inter = schedule.scheduleJob('saida', minuto_saida_inter + ' 0 * * 1-5', async () => {
            bot.sendMessage(chatId, 'Iniciando cronJOB para bater o ponto de saida as 00:' + minuto_saida_inter)
            bate_ponto.aponta(chatId,bot,reinicia_processo);
        }, null, true, 'America/Sao_Paulo')
}

module.exports = {
    cronActiveInter: cronActiveInter
}
