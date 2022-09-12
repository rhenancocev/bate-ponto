const agendamento = require('../funcoes/agendamento-bate-ponto')
var bot = require('../tokenAcesso/serverTelegramBot');
const env = require('../../.env');
var chat_id = env.CHAT_ID

bot.onText(/\/stop/, async (ctx,match) => {
    const chatId = ctx.chat.id;
    const nome = ctx.from.first_name;
    const ativar = false;
    const reinicia_processo = false
    if (chatId == chat_id){
        await bot.sendMessage(chatId, nome + ", foi solicitado o cancelamento dos schedules!");
        agendamento.cronActive(chatId,bot,ativar,reinicia_processo);
    } else {
        bot.sendMessage(chatId, nome + ", você não está autorizado para utilizar o bot.");
    } 
});