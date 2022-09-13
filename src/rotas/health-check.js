var bot = require('../tokenAcesso/serverTelegramBot');
const env = require('../../.env');
const ping = require('../funcoes/ping')
var chat_id = env.CHAT_ID

bot.onText(/\/ping/, async (ctx,match) => {
    const chatId = ctx.chat.id;
    const nome = ctx.from.first_name;
    if (chatId == chat_id){
        await bot.sendMessage(chatId, nome + ", aguarde enquanto verifico sua conexão!");
        ping.ping(chatId,bot);
    } else {
        bot.sendMessage(chatId, nome + ", você não está autorizado para utilizar o bot.");
    } 
        
});