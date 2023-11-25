const schedule = require('node-schedule');
const bate_ponto = require('./bate-ponto');

function agendamentoCron (chatId,bot,reinicia_processo,hora,minuto){

    bot.sendMessage(chatId, 'Agendamos schedule manual para bater o ponto. \n' 
                    + '\nSeu ponto será batido as ' + hora + ':' + minuto)

    const agendamento = schedule.scheduleJob('schedule_manual', minuto + ' ' + hora + ' * * 0-6', () => {
        console.log('Iniciando schedule manual para bater o ponto as ' + hora + ':' + minuto)
        bot.sendMessage(chatId, 'Iniciando schedule manual para bater o ponto as ' + hora + ':' + minuto)
        bate_ponto.aponta(chatId,bot,reinicia_processo);
    }, null, true, 'America/Sao_Paulo')

}

module.exports = {
    agendamentoCron: agendamentoCron
}