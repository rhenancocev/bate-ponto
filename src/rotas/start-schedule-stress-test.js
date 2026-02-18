const agendamento = require('../funcoes/agendamento-bate-ponto-stress-test')
const env = require('../../config');
var chat_id = env.CHAT_ID

module.exports = async (ctx, bot) => {
    const chatId = ctx.chat.id;
    const nome = ctx.from.first_name;
    if (chatId == chat_id){
        await bot.sendMessage(chatId, nome + ", ja schedulei seu job para mais um STRESS TEST:");
        agendamento.cronActiveStressTest(chatId,bot);
    } else {
        bot.sendMessage(chatId, nome + ", você não está autorizado para utilizar o bot.");
    } 
        
};