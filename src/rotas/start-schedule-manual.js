const env = require('../../config');
const agendamento_manual = require('../funcoes/agendamento-bate-ponto-manual');
var chat_id = env.CHAT_ID

module.exports = async (ctx, bot) => {
    const chatId = ctx.chat.id;
    const nome = ctx.from.first_name;
    const hora_minuto_saida = ctx.text.split(" ");
    var entradaesaida = hora_minuto_saida[1]
    var hora = hora_minuto_saida[2]
    var minuto = hora_minuto_saida[3]
    var hora_saida = hora_minuto_saida[4]
    var minuto_saida = hora_minuto_saida[5]

    if(hora === undefined || minuto === undefined || entradaesaida === undefined){
        bot.sendMessage(chatId, nome + ", você precisa inserir os parametros.\n"
                        + "\n Exemplo: /schedule entrada_e_saida hora minuto"
                        + "\n Exemplo: /schedule entrada_e_saida hora_entrada minuto_entrada hora_saida minuto_saida");
    }else{
        if (chatId == chat_id){
          switch(entradaesaida){
            case "true":
              await agendamento_manual.cronActiveManual(chatId,bot,hora,minuto,hora_saida,minuto_saida,entradaesaida);
              break;
            case "false":
              await agendamento_manual.cronActiveManual(chatId,bot,hora,minuto,undefined,undefined,entradaesaida);
              break;
            default:
              bot.sendMessage(chatId, nome + ", o parametro entradaesaida deve ser 'true' ou 'false'.");
              return;
          }
        } else {
            bot.sendMessage(chatId, nome + ", você não está autorizado para utilizar o bot.");
        }
    }
};