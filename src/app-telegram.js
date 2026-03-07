const env = require('../config');
const agendamento = require('./funcoes/agendamento-bate-ponto');
const start_schedule_manual = require('./rotas/start-schedule-manual');
const start_schedule = require('./rotas/start-schedule');
const start_schedule_1he = require('./rotas/start-schedule-1he');
const start_schedule_stress_test = require('./rotas/start-schedule-stress-test');
const start_schedule_inter = require('./rotas/start-schedule-inter');
const stop_schedule = require('./rotas/stop-schedule');
const aponta = require('./rotas/apontamento-manual');
const ping = require('./rotas/health-check');
const ultimo_ponto = require('./rotas/ultimo-ponto');
const reboot_application = require('./rotas/reboot-application');
const trabalhar_feriado = require('./rotas/trabalhar');
const folga = require('./rotas/folga');
const update_password = require('./rotas/mudar-senha');
const { restaurar } = require('./helpers/scheduler-restore');
const persistence = require('./helpers/scheduler-persistence');
const chat_id = env.CHAT_ID;
const horasaida = 18;
const bot = require('./tokenAcesso/serverTelegramBot');
process.env.NTBA_FIX_350 = 1;
process.env.NTBA_FIX_319 = 1;

let isInitialized = false;

async function initializeBot() {

  if (isInitialized) return;
  console.log('[BOOT] Inicializando bot...');
  await bot.sendMessage(chat_id, "Bot iniciado automaticamente.");
  // aguarda estabilizar polling
  await new Promise(r => setTimeout(r, 5000));
  if (persistence.existeEstado()) {
    console.log('[BOOT] Estado encontrado. Restaurando scheduler...');
    await bot.sendMessage(chat_id,"[BOOT] Estado encontrado. Restaurando scheduler...");
    await restaurar(bot, chat_id);
  } else {
    console.log('[BOOT] Nenhum estado salvo. Criando novo schedule...');
    await bot.sendMessage(chat_id,"[BOOT] Nenhum estado salvo. Criando novo schedule...");
    await agendamento.cronActive(chat_id, bot, horasaida);
  }
  isInitialized = true;
}

// evita crash silencioso
initializeBot().catch(err => {
  console.error('[BOOT ERROR]', err);
});

// graceful shutdown (Kubernetes)
process.on('SIGTERM', async () => {
  console.log('[BOT] stopping polling...');
  await bot.stopPolling();
  process.exit(0);
});

// captura Promises esquecidas
process.on('unhandledRejection', err => {
  console.error('[UNHANDLED]', err);
});

bot.on('text', (ctx) => {
  const comando = ctx.text.split(" ")[0];
  switch (comando) {
    case '/start': start_schedule(ctx, bot); break;
    case '/1he_start': start_schedule_1he(ctx, bot); break;
    case '/stress_test_schedule': start_schedule_stress_test(ctx, bot); break;
    case '/inter': start_schedule_inter(ctx, bot); break;
    case '/stop': stop_schedule(ctx, bot); break;
    case '/aponta': aponta(ctx, bot); break;
    case '/ping': ping(ctx, bot); break;
    case '/ponto': ultimo_ponto(ctx, bot); break;
    case '/reboot': reboot_application(ctx, bot); break;
    case '/trabalhar': trabalhar_feriado(ctx, bot); break;
    case '/folga': folga(ctx, bot); break;
    case '/schedule': start_schedule_manual(ctx, bot); break;
    case '/mudar_senha': update_password(ctx, bot); break;
  }
});
