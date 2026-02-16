const empresa = require('../helpers/feriados-ignore-empresa');

module.exports = async (ctx, bot) => {

  const chatId = ctx.chat.id;
  const args = ctx.text.split(' ');

  if (!args[1]) {
    return bot.sendMessage(chatId, "Use: /trabalhar DD-MM-AAAA");
  }

  const [dia, mes, ano] = args[1].split('-');

  if (!dia || !mes || !ano) {
    return bot.sendMessage(chatId, "Formato inválido. Use DD-MM-AAAA");
  }

  const dataISO = `${ano}-${mes.padStart(2,'0')}-${dia.padStart(2,'0')}`;

  empresa.adicionar(dataISO);

  await bot.sendMessage(
    chatId,
    `Dia ${args[1]} marcado como DIA ÚTIL pela empresa.`
  );
};
