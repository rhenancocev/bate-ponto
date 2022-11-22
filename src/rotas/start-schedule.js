const agendamento = require('../funcoes/agendamento-bate-ponto')
var bot = require('../tokenAcesso/serverTelegramBot');
const env = require('../../.env');
var chat_id = env.CHAT_ID

bot.onText(/\/start/, async (ctx,match) => {
    const chatId = ctx.chat.id;
    const nome = ctx.from.first_name;
    const reinicia_processo = true
    if (chatId == chat_id){
        await bot.sendMessage(chatId, nome + ", ja schedulei seu job:");
        agendamento.cronActive(chatId,bot,reinicia_processo);
    } else {
        bot.sendMessage(chatId, nome + ", você não está autorizado para utilizar o bot.");
    } 
        
});