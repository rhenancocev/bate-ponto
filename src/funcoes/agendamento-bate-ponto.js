const schedule = require('node-schedule');
const bate_ponto = require('./bate-ponto')
const random = require('./random')

async function cronActive (ctx,bot,status,cronJOB,reinicia_processo,hora,minuto){

    const timeElapsed = Date.now();
    const today = new Date(timeElapsed);
    const chatId = ctx;
    const min_entrada = 0;
    const max_entrada = 35;
    const min_saida = 50;
    const max_saida = 51;
    const min_almoco = 1;
    const max_almoco = 51;
    var hora_saida = 18;
    var cron_entrada = random.between(min_entrada,max_entrada);
    var cron_saida = random.between(min_saida,max_saida);
    var minuto_saida = cron_entrada + cron_saida;
    var cron_entrada_almoco = random.between(min_almoco,max_almoco);
    var minuto_saida_almoco = (cron_entrada_almoco + 62) % 60;

    if(minuto_saida >= 60){
        hora_saida += 1;
        minuto_saida = (cron_entrada + cron_saida) % 60
    }

    const scheduleList = schedule.scheduledJobs;
    if (scheduleList['entrada', 'almoco', 'volta_almoco', 'saida'] != undefined) {
        //Nesse caso, caso ele ache o nome do processo na lista vamos utilizar o nome dele para cancela-lo.
        schedule.gracefulShutdown();
    }

    if (status && cronJOB == false){
        console.log('===================== ' + today.toLocaleDateString() + ' =====================')
        console.log('Sua entrada vai ser 9:' + cron_entrada);
        console.log('Sua entrada do almoço vai ser 12:'+ cron_entrada_almoco);
        console.log('Sua saida do almoço vai ser 13:'+ minuto_saida_almoco);
        console.log('Sua saida vai ser '+ hora_saida + ':' + minuto_saida);
        console.log('===================== AGUARDANDO SCHEDULE =====================')
    
        bot.sendMessage(chatId, 'DATA: ' + today.toLocaleDateString() + ' \n'
                        + '\nSua entrada vai ser 9:' + cron_entrada
                        + '\nSua entrada do almoço vai ser 12:'+ cron_entrada_almoco
                        + '\nSua saida do almoço vai ser 13:'+ minuto_saida_almoco
                        + '\nSua saida vai ser '+ hora_saida + ':' + minuto_saida
                        + '\n\nSTATUS: AGUARDANDO SCHEDULE');
    }

    if(cronJOB && status == false){
        bot.sendMessage(chatId, 'Agendamos schedule manual para bater o ponto. \n' 
                        + '\nSeu ponto será batido as ' + hora + ':' + minuto)

        const agendamento = schedule.scheduleJob('schedule_manual', minuto + ' ' + hora + ' * * 1-5', async () => {
            console.log('Iniciando schedule manual para bater o ponto as ' + hora + ':' + minuto)
            bot.sendMessage(chatId, 'Iniciando schedule manual para bater o ponto as ' + hora + ':' + minuto)
            bate_ponto.aponta(chatId,bot,reinicia_processo);
        }, null, true, 'America/Sao_Paulo')
    }
    
        const entrada = schedule.scheduleJob('entrada', cron_entrada + ' 9 * * 1-5', () => {
            console.log('Iniciando cronJOB para bater o ponto de entrada as 09:' + cron_entrada)
            bot.sendMessage(chatId, 'Iniciando cronJOB para bater o ponto de entrada as 09:' + cron_entrada)
            bate_ponto.aponta(chatId,bot);
        }, null, true, 'America/Sao_Paulo')
    
        const almoco = schedule.scheduleJob('almoco', cron_entrada_almoco + ' 12 * * 1-5', () => {
            console.log('Iniciando cronJOB para bater o ponto de entrada do almoço as 12:' + cron_entrada_almoco)
            bot.sendMessage(chatId, 'Iniciando cronJOB para bater o ponto de entrada do almoço as 12:' + cron_entrada_almoco)
            bate_ponto.aponta(chatId,bot);
        }, null, true, 'America/Sao_Paulo')
    
        const volta_almoco = schedule.scheduleJob('volta_almoco', minuto_saida_almoco + ' 13 * * 1-5', () => {
            console.log('Iniciando cronJOB para bater o ponto de saida do almoço as 13:' + minuto_saida_almoco)
            bot.sendMessage(chatId, 'Iniciando cronJOB para bater o ponto de saida do almoço as 13:' + minuto_saida_almoco)
            bate_ponto.aponta(chatId,bot);
        }, null, true, 'America/Sao_Paulo')
    
        const saida = schedule.scheduleJob('saida', minuto_saida + ' ' + hora_saida + ' * * 1-5', async () => {
            console.log('Iniciando cronJOB para bater o ponto de saida as ' + hora_saida + ':' + minuto_saida)
            bot.sendMessage(chatId, 'Iniciando cronJOB para bater o ponto de saida as ' + hora_saida + ':' + minuto_saida)
            bate_ponto.aponta(chatId,bot,reinicia_processo);
        }, null, true, 'America/Sao_Paulo')

        if(status == false && cronJOB == false){
            entrada.cancel()
            almoco.cancel()
            volta_almoco.cancel()
            saida.cancel()
            console.log('cancelados')
            schedule.gracefulShutdown();
            bot.sendMessage(chatId, 'Todos os schedules foram cancelados com sucesso.');
        }
}

module.exports = {
    cronActive: cronActive
}