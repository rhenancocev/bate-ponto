const empresa = require('../helpers/ignore-feriados-e-add-folgas');

module.exports = async (ctx, bot) => {

  const chatId = ctx.chat.id;

  // remove espaços extras
  const args = ctx.text.trim().split(/\s+/);

  if (!args[1]) {
    return bot.sendMessage(chatId, "Use: /folga DD-MM-AAAA");
  }

  // aceita 10-10-2026 ou 10/10/2026
  const partes = args[1].replace(/\//g, '-').split('-');
  const [dia, mes, ano] = partes;

  if (!dia || !mes || !ano) {
    return bot.sendMessage(chatId, "Formato inválido. Use DD-MM-AAAA");
  }

  const dataISO = `${ano}-${mes.padStart(2,'0')}-${dia.padStart(2,'0')}`;

  // valida data real
  const testeData = new Date(`${dataISO}T00:00:00-03:00`);
  if (isNaN(testeData.getTime())) {
    return bot.sendMessage(chatId, "Data inválida.");
  }

  // garante consistência:
  // se marcar folga, remove dos dias trabalhados
  empresa.remover(dataISO);

  empresa.adicionarFolga(dataISO);

  await bot.sendMessage(
    chatId,
    `Dia ${args[1]} marcado como FOLGA pessoal. Nenhum ponto será registrado.`
  );
};
