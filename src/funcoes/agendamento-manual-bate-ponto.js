const schedule = require('node-schedule');
const bate_ponto = require('./bate-ponto');

function agendamentoCron (chatId,bot,reinicia_processo,hora,minuto){

    bot.sendMessage(chatId, 'Agendamos schedule manual para bater o ponto. \n' 
                    + '\nSeu ponto será batido as ' + hora + ':' + minuto)

    schedule.scheduleJob('schedule_manual', {minute: minuto, hour: hora, dayOfWeek: new schedule.Range(0, 6),tz: 'America/Sao_Paulo'}, () => {
        bot.sendMessage(chatId,'Iniciando schedule manual para bater o ponto às ' + hora + ':' + minuto);
        bate_ponto.aponta(chatId, bot, reinicia_processo);
    });

}

module.exports = {
    agendamentoCron: agendamentoCron
}