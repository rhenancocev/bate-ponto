const env = require('../../config');
const puppeteer = require('puppeteer');
const fs = require('fs');
const { getSenhaAtual, saveNovaSenha } = require('../helpers/gestao-de-senha');

async function updatePassword(chatId, bot, novaSenha) {

  let browser;

  try {
    const { HOST, ID_EMPRESA, MATRICULA } = env;
    const senhaAtual = getSenhaAtual();

    if (!senhaAtual) {
      throw new Error('Senha atual nao encontrada em data/config.json');
    }

    if (!novaSenha) {
      throw new Error('Nova senha inválida.');
    }

    browser = await puppeteer.launch({
      args: [
        '--disable-setuid-sandbox',
        '--no-sandbox',
        '--ignore-certificate-errors',
        '--disable-dev-shm-usage',
        '--disable-gpu',
        '--no-zygote',
        '--single-process'
      ],
      executablePath: '/usr/bin/chromium',
      ignoreHTTPSErrors: true, 
      headless: true
    });

    const page = await browser.newPage();
    page.setDefaultNavigationTimeout(30000);

    await page.goto(HOST, { waitUntil: 'networkidle2' });

    await page.type('[name="CD_EMPGCB_FUN"]', ID_EMPRESA);
    await page.type('[name="CD_FUN"]', MATRICULA);
    await page.type('[name="CD_USRSGR_SNH_CPL"]', senhaAtual);

    await Promise.all([
      page.waitForNavigation({ waitUntil: 'networkidle2' }),
      page.click('[name="NM_BOT_PRC"]')
    ]);

    await page.click('body > form:nth-child(2) > table:nth-child(3) > tbody:nth-child(1) > tr:nth-child(2) > td:nth-child(1) > select:nth-child(1) > option:nth-child(1)');

    console.log("Processando...");

    await Promise.all([
      page.waitForNavigation({ waitUntil: 'networkidle2' }),
      page.click('[name="NM_BOT_PRC"]')
    ]);

    await page.type('[name="CD_ANT_USR_SGR"]', senhaAtual);
    await page.type('[name="CD_NVA_USR_SGR"]', novaSenha);
    await page.type('[name="CD_REG_NVA_USR_SGR"]', novaSenha);

    await Promise.all([
      page.waitForNavigation({ waitUntil: 'networkidle2' }),
      page.click('[id="NM_BOT_PRC"]')
    ]);

    saveNovaSenha(novaSenha);

    await page.screenshot({ path: 'senha_alterada.png' });

    if (chatId) {
      await bot.sendMediaGroup(chatId, [
      { type: 'photo', media: fs.createReadStream('senha_alterada.png') }
      ]);
    }

    await page.click('[id="NM_BOT_FIM"]');
    if (chatId) {
      await bot.sendMessage(chatId, "✅ Senha alterada com sucesso!");
    }

  } catch (error) {
    console.error("Erro ao alterar senha:", error);
    if (chatId) {
      await bot.sendMessage(chatId, "Erro ao alterar senha:\n" + error.message);
    }
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

module.exports = {
  updatePassword
};
