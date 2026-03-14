const { updatePassword } = require ('../../funcoes/mudar-senha');

module.exports = async (ctx, bot, estado, estadoUsuarios) => {

  const chatId = ctx.chat.id;
  const texto = ctx.text.trim();

  switch (estado.step) {
    case 1:
      await updatePassword(chatId, bot, texto);
      delete estadoUsuarios[chatId];
      return;
  }
};