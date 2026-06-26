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
      executablePath: '/usr/bin/chromium',
      headless: true,
      ignoreHTTPSErrors: true,
      protocolTimeout: 120000,
      args: [
        '--disable-setuid-sandbox',
        '--no-sandbox',
        '--ignore-certificate-errors',
        '--disable-dev-shm-usage',
        '--disable-gpu',
        '--no-zygote',
        '--single-process'
      ]
    });

    const page = await browser.newPage();
    page.setDefaultTimeout(120000);
    page.setDefaultNavigationTimeout(120000);

    await page.goto(HOST, {
      waitUntil: 'domcontentloaded',
      timeout: 120000
    });

    await page.type('[name="CD_EMPGCB_FUN"]', ID_EMPRESA);
    await page.type('[name="CD_FUN"]', MATRICULA);
    await page.type('[name="CD_USRSGR_SNH_CPL"]', senhaAtual);

    await page.evaluate(() => {
      const el = document.querySelector('[name="NM_BOT_PRC"]');
      if (el) el.click();
    });

    await new Promise(r => setTimeout(r, 5000));

    const selectSelector =
      'body > form:nth-child(2) > table:nth-child(3) > tbody:nth-child(1) > tr:nth-child(2) > td:nth-child(1) > select:nth-child(1)';

    const valorOption = await page.$eval(
      selectSelector,
      select => {
        if (select.options.length >= 1) {
          return select.options[0].value;
        }
        return null;
      }
    );

    if (!valorOption) {
      throw new Error('Não foi possível encontrar a opção de troca de senha');
    }

    await page.select(selectSelector, valorOption);

    console.log('Processando alteração de senha...');

    await page.evaluate(() => {
      const el = document.querySelector('[name="NM_BOT_PRC"]');
      if (el) el.click();
    });

    await new Promise(r => setTimeout(r, 5000));

    await page.type('[name="CD_ANT_USR_SGR"]', senhaAtual);
    await page.type('[name="CD_NVA_USR_SGR"]', novaSenha);
    await page.type('[name="CD_REG_NVA_USR_SGR"]', novaSenha);

    await page.evaluate(() => {
      const el = document.querySelector('#NM_BOT_PRC');
      if (el) el.click();
    });

    await new Promise(r => setTimeout(r, 8000));

    saveNovaSenha(novaSenha);

    await page.screenshot({
      path: 'senha_alterada.png',
      fullPage: true
    });

    if (chatId) {

      await bot.sendMediaGroup(chatId, [
        {
          type: 'photo',
          media: fs.createReadStream('senha_alterada.png')
        }
      ]);

      await bot.sendMessage(
        chatId,
        '✅ Senha alterada com sucesso!'
      );
    }

    await page.evaluate(() => {
      const el = document.querySelector('#NM_BOT_FIM');
      if (el) el.click();
    });

  } catch (error) {

    console.error('Erro ao alterar senha:', error);

    if (chatId) {
      await bot.sendMessage(
        chatId,
        'Erro ao alterar senha:\n' + error.message
      );
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