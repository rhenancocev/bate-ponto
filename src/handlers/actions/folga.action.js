const empresa = require('../../helpers/ignore-feriados-e-add-folgas');

module.exports = async (ctx, bot, estado, estadoUsuarios) => {

  const chatId = ctx.chat.id;
  const texto = ctx.text.trim();

  switch (estado.step) {
    case 1:
      const partes = texto.replace(/\//g, '-').split('-');
      const [dia, mes, ano] = partes;

      if (!dia || !mes || !ano) {
        return bot.sendMessage(chatId, "Formato inválido. Use DD-MM-AAAA");
      }

      const d = parseInt(dia);
      const m = parseInt(mes);
      const a = parseInt(ano);

      if (
        isNaN(d) || isNaN(m) || isNaN(a) ||
        d < 1 || d > 31 ||
        m < 1 || m > 12 ||
        ano.length !== 4
      ) {
        return bot.sendMessage(chatId, "Data inválida. Use DD-MM-AAAA.");
      }

      const dataISO = `${a}-${String(m).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
      const testeData = new Date(`${dataISO}T00:00:00-03:00`);

      if (isNaN(testeData.getTime())) {
        return bot.sendMessage(chatId, "Data inválida.");
      }

      // consistência
      empresa.remover(dataISO);
      empresa.adicionarFolga(dataISO);

      await bot.sendMessage(chatId, `Dia ${texto} marcado como FOLGA pessoal. Nenhum ponto será registrado.`);
      delete estadoUsuarios[chatId];
      return;
  }
};