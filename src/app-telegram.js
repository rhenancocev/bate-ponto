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
const my_password = require('./rotas/minha-senha');
const { restaurar } = require('./helpers/scheduler-restore');
const persistence = require('./helpers/scheduler-persistence');
const tratarEstado = require('./handlers/state-handler');
const chat_id = env.CHAT_ID;
const horasaida = 18;
const estadoUsuarios = {};
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

  const chatId = ctx.chat.id;
  const texto = ctx.text?.trim();
  if (!texto) return;

  // 🔹 Se usuário tem estado ativo
  if (estadoUsuarios[chatId]) {
    return tratarEstado(ctx, bot, estadoUsuarios[chatId], estadoUsuarios);
  }

  const comando = texto.split(" ")[0];
  switch (comando) {
    case '/start': return start_schedule(ctx, bot);
    case '/1he_start': return start_schedule_1he(ctx, bot);
    case '/stress_test_schedule': return start_schedule_stress_test(ctx, bot);
    case '/inter': return start_schedule_inter(ctx, bot);
    case '/stop': return stop_schedule(ctx, bot);
    case '/aponta': return aponta(ctx, bot);
    case '/ping': return ping(ctx, bot);
    case '/ponto': return ultimo_ponto(ctx, bot);
    case '/reboot': return reboot_application(ctx, bot);
    case '/trabalhar': return trabalhar_feriado(ctx, bot, estadoUsuarios);
    case '/folga': return folga(ctx, bot, estadoUsuarios);
    case '/schedule': return start_schedule_manual(ctx, bot, estadoUsuarios);
    case '/mudar_senha': return update_password(ctx, bot, estadoUsuarios);
    case '/senha_atual': return my_password(ctx, bot);
  }
});
