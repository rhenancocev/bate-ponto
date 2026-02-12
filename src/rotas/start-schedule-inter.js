const agendamento = require('../funcoes/agendamento-bate-ponto-inter')
const env = require('../../config');
var chat_id = env.CHAT_ID

module.exports = async (ctx, bot) => {
    const chatId = ctx.chat.id;
    const nome = ctx.from.first_name;
    const reinicia_processo = true
    if (chatId == chat_id){
        await bot.sendMessage(chatId, nome + ", ja schedulei seu job de inter:");
        agendamento.cronActiveInter(chatId,bot,reinicia_processo);
    } else {
        bot.sendMessage(chatId, nome + ", você não está autorizado para utilizar o bot.");
    } 
        
};