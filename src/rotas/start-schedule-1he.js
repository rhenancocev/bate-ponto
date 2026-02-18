const agendamento = require('../funcoes/agendamento-bate-ponto')
const env = require('../../config');
var chat_id = env.CHAT_ID

module.exports = async (ctx, bot) => {
    const chatId = ctx.chat.id;
    const nome = ctx.from.first_name;
    const horasaida = 19
    if (chatId == chat_id){
        await bot.sendMessage(chatId, nome + ", ja schedulei seu job:");
        agendamento.cronActive(chatId,bot,horasaida);
    } else {
        bot.sendMessage(chatId, nome + ", você não está autorizado para utilizar o bot.");
    } 
        
};