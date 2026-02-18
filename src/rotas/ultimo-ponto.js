const env = require('../../config');
const fs = require('fs');
const path = require('path');

var chat_id = env.CHAT_ID;

module.exports = async (ctx, bot) => {

  const chatId = ctx.chat.id;
  const nome = ctx.from.first_name;

  if (chatId == chat_id){

    await bot.sendMessage(
      chatId,
      `${nome}, segue seu ultimo ponto batido:`
    );

    const filePath = path.join(process.cwd(), 'src', 'ponto.png');

    await bot.sendPhoto(
      chatId,
      fs.createReadStream(filePath)
    );

  } else {
    await bot.sendMessage(
      chatId,
      `${nome}, você não está autorizado para utilizar o bot.`
    );
  }
};