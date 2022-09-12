const agendamento_manual = require('../funcoes/agendamento-manual-bate-ponto')
var bot = require('../tokenAcesso/serverTelegramBot');
const env = require('../../.env');
var chat_id = env.CHAT_ID

bot.onText(/\/schedule/, (ctx,match) => {
    const chatId = ctx.chat.id;
    const nome = ctx.from.first_name;
    const hora_minuto = ctx.text.split(" ");
    var reinicia_processo = true
    var hora = hora_minuto[1]
    var minuto = hora_minuto[2]

    if(hora === undefined || minuto === undefined){
        bot.sendMessage(chatId, nome + ", você precisa inserir os parametros.\n"
                        + "\n Exemplo: /schedule hora minuto");
    }else{
        if (chatId == chat_id){
            agendamento_manual.agendamentoCron(chatId,bot,reinicia_processo,hora,minuto);
        } else {
            bot.sendMessage(chatId, nome + ", você não está autorizado para utilizar o bot.");
        }
    }
});