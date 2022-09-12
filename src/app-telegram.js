const env = require('../.env');
const agendamento = require('./funcoes/agendamento-bate-ponto');
const start_schedule = require('./rotas/start-schedule');
const stop_schedule = require('./rotas/stop-schedule');
const create_schedule = require('./rotas/create-schedule');
const aponta = require('./rotas/apontamento-manual');
const ping = require('./rotas/health-check');
const ultimo_ponto = require('./rotas/ultimo-ponto');
var chat_id = env.CHAT_ID;
var bot = require ('./tokenAcesso/serverTelegramBot');

process.env["NTBA_FIX_350"] = 1;
process.env.NTBA_FIX_319 = 1;

var ativar = true;
var reinicia_processo = true;

//precisei inicializar aqui, por conta do exit process.
agendamento.cronActive(chat_id,bot,ativar,reinicia_processo);

bot.on('text', (ctx) => {

    espaco = ctx.text.split(" ");
    var comando = espaco[0];

    switch (comando) {
        case '/start': start_schedule;
            break;
        case '/stop': stop_schedule;
            break;
        case '/schedule': create_schedule;
            break;
        case '/aponta': aponta;
            break;
        case '/ping': ping;
            break;
        case '/ponto': ultimo_ponto;
            break;    
    }

});