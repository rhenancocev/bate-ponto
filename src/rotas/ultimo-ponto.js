var bot = require('../tokenAcesso/serverTelegramBot');
const env = require('../../.env');
var chat_id = env.CHAT_ID

bot.onText(/\/ponto/, (ctx,match) => {
    const chatId = ctx.chat.id;
    const nome = ctx.from.first_name;
    if (chatId == chat_id){
        bot.sendMessage(chatId, nome + ", segue seu ultimo ponto batido:");
        bot.sendMediaGroup(chatId, [{type: 'photo',media: './ponto.png'}]);
    } else {
        bot.sendMessage(chatId, nome + ", você não está autorizado para utilizar o bot.");
    } 
        
});