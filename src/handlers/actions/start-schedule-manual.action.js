const { cronActiveManual } = require('../../funcoes/agendamento-bate-ponto-manual');

module.exports = async (ctx, bot, estado, estadoUsuarios) => {

  const chatId = ctx.chat.id;
  const texto = ctx.text.trim();

  switch (estado.step) {
    case 1:
      const resposta = texto.toLowerCase();
      if (resposta !== 'sim' && resposta !== 'nao') {
        return bot.sendMessage(chatId, "Digite sim ou nao.");
      }

      estado.dados.entradaesaida = resposta;
      estado.step = 2;

      return bot.sendMessage(chatId, "Digite horário de entrada (HH MM)");

    case 2:
      const [hEntrada, mEntrada] = texto.trim().split(/\s+/);
      const hora = parseInt(hEntrada);
      const minuto = parseInt(mEntrada);

      if (
        isNaN(hora) || isNaN(minuto) ||
        hora < 0 || hora > 23 ||
        minuto < 0 || minuto > 59
      ) {
        return bot.sendMessage(chatId, "Horário inválido.");
      }

      estado.dados.horaentrada = hora;
      estado.dados.minutoentrada = minuto;

      if (estado.dados.entradaesaida === 'nao') {

        await cronActiveManual(
          chatId,
          bot,
          estado.dados.horaentrada,
          estado.dados.minutoentrada,
          undefined,
          undefined,
          'nao'
        );

        delete estadoUsuarios[chatId];
        return;
      }

      estado.step = 3;
      return bot.sendMessage(chatId, "Digite horário de saída (HH MM)");

    case 3:
      const [hSaida, mSaida] = texto.trim().split(/\s+/);
      const horaSaida = parseInt(hSaida);
      const minutoSaida = parseInt(mSaida);

      if (
        isNaN(horaSaida) || isNaN(minutoSaida) ||
        horaSaida < 0 || horaSaida > 23 ||
        minutoSaida < 0 || minutoSaida > 59
      ) {
        return bot.sendMessage(chatId, "Horário de saída inválido.");
      }

      estado.dados.horasaida = horaSaida;
      estado.dados.minutosaida = minutoSaida;

      await cronActiveManual(
        chatId,
        bot,
        estado.dados.horaentrada,
        estado.dados.minutoentrada,
        estado.dados.horasaida,
        estado.dados.minutosaida,
        'sim'
      );

      delete estadoUsuarios[chatId];
      return;
  }
};