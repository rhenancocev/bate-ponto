const env = require('../config');
const agendamento = require('./funcoes/agendamento-bate-ponto');
const start_schedule = require('./rotas/start-schedule');
const start_schedule_1he = require('./rotas/start-schedule-1he');
const start_schedule_stress_test = require('./rotas/start-schedule-stress-test');
const start_schedule_personalizado = require('./rotas/start-schedule-personalizado');
const start_schedule_inter = require('./rotas/start-schedule-inter');
const stop_schedule = require('./rotas/stop-schedule');
const create_schedule = require('./rotas/create-schedule');
const aponta = require('./rotas/apontamento-manual');
const ping = require('./rotas/health-check');
const ultimo_ponto = require('./rotas/ultimo-ponto');
const reboot_application = require('./rotas/reboot-application');
const trabalhar_feriado = require('./rotas/trabalhar');

const chat_id = env.CHAT_ID;
const bot = require('./tokenAcesso/serverTelegramBot');

process.env["NTBA_FIX_350"] = 1;
process.env.NTBA_FIX_319 = 1;

const reinicia_processo = true;
const horasaida = 18;

let isInitialized = false;

// Inicialização
function initializeBot() {
  if (!isInitialized) {
    bot.sendMessage(chat_id, "Bot iniciado automaticamente.");
    agendamento.cronActive(chat_id, bot, reinicia_processo, horasaida);
    isInitialized = true;
  }
}

initializeBot();

bot.on('text', (ctx) => {
  const espaco = ctx.text.split(" ");
  const comando = espaco[0];

  switch (comando) {
    case '/start':
      start_schedule(ctx, bot);
      break;
    case '/1he_start':
      start_schedule_1he(ctx, bot);
      break;
    case '/stress_test_schedule':
      start_schedule_stress_test(ctx, bot);
      break;
    case '/personalizado_schedule':
      start_schedule_personalizado(ctx, bot);
      break;
    case '/inter':
      start_schedule_inter(ctx, bot);
      break;
    case '/stop':
      stop_schedule(ctx, bot);
      break;
    case '/schedule':
      create_schedule(ctx, bot);
      break;
    case '/aponta':
      aponta(ctx, bot);
      break;
    case '/ping':
      ping(ctx, bot);
      break;
    case '/ponto':
      ultimo_ponto(ctx, bot);
      break;
    case '/reboot':
      reboot_application(ctx, bot);
      break;
    case '/trabalhar':
      trabalhar_feriado(ctx, bot);
      break;
  }
});