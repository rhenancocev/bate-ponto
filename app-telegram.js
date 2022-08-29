const TelegramBot = require('node-telegram-bot-api');
require('dotenv').config();
const bate_ponto = require('./bate-ponto')

const teste = require('./teste')

const agendamento = require('./agendamento-bate-ponto')

const token = process.env.TOKEN;
const chat_id = 621550962;
// replace the value below with the Telegram token you receive from @BotFather

// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(token, { polling: true });
process.env["NTBA_FIX_350"] = 1;
process.env.NTBA_FIX_319 = 1;

//precisei inicializar aqui, por conta do exit process.
agendamento.cronActive(chat_id,bot,true);

bot.onText(/\/aponta/, (ctx,match) => {
    const chatId = ctx.chat.id;
    const nome = ctx.from.first_name;
    if (chatId === chat_id){
        bot.sendMessage(chatId, nome + ", aguarde enquanto bato seu ponto...");
        bate_ponto.aponta(chatId,bot);
    } else {
        bot.sendMessage(chatId, nome + ", você não está autorizado para utilizar o bot.");
    } 
});

bot.onText(/\/start/, async (ctx,match) => {
    const chatId = ctx.chat.id;
    const nome = ctx.from.first_name;
    var ativar = true;
    if (chatId === chat_id){
        await bot.sendMessage(chatId, nome + ", ja schedulei seu job:");
        agendamento.cronActive(chatId,bot,ativar);
    } else {
        bot.sendMessage(chatId, nome + ", você não está autorizado para utilizar o bot.");
    } 
        
});

bot.onText(/\/stop/, async (ctx,match) => {
    const chatId = ctx.chat.id;
    const nome = ctx.from.first_name;
    var ativar = false;
    if (chatId === chat_id){
        await bot.sendMessage(chatId, nome + ", cancelei todos os seus schedules");
        agendamento.cronActive(chatId,bot,ativar);
    } else {
        bot.sendMessage(chatId, nome + ", você não está autorizado para utilizar o bot.");
    } 
        
});

bot.onText(/\/ping/, (ctx,match) => {
    const chatId = ctx.chat.id;
    const nome = ctx.from.first_name;
    if (chatId === chat_id){
        bot.sendMessage(chatId, nome + ", você está conectado.");
    } else {
        bot.sendMessage(chatId, nome + ", você não está autorizado para utilizar o bot.");
    } 
        
});