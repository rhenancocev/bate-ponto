const env = require('../../config');
const { getSenhaAtual } = require('../helpers/gestao-de-senha');
const puppeteer = require('puppeteer');
const fs = require('fs');

async function aponta(ctx, bot) {

  let browser;

  try {
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

    const { HOST, ID_EMPRESA, MATRICULA } = env;
    const SENHA = getSenhaAtual();

    await page.goto(HOST, { waitUntil: 'networkidle2' });

    await page.type('[name="CD_EMPGCB_FUN"]', ID_EMPRESA);
    await page.type('[name="CD_FUN"]', MATRICULA);
    await page.type('[name="CD_USRSGR_SNH_CPL"]', SENHA);

    await Promise.all([
      page.waitForNavigation({ waitUntil: 'networkidle2' }),
      page.click('[name="NM_BOT_PRC"]')
    ]);

    await page.click('body > form:nth-child(2) > table:nth-child(3) > tbody:nth-child(1) > tr:nth-child(2) > td:nth-child(1) > select:nth-child(1) > option:nth-child(5)');

    console.log("Processando...");

    await Promise.all([
      page.waitForNavigation({ waitUntil: 'networkidle2' }),
      page.click('[name="NM_BOT_PRC"]')
    ]);

    await Promise.all([
      page.waitForNavigation({ waitUntil: 'networkidle2' }),
      page.click('[id="NM_BOT_PRC"]')
    ]);

    await page.screenshot({ path: 'ponto.png' });

    await bot.sendMessage(ctx, "Ponto batido com sucesso:");
    await bot.sendMediaGroup(ctx, [
      { type: 'photo', media: fs.createReadStream('ponto.png') }
    ]);

    await page.click('[id="NM_BOT_FIM"]');

    await bot.sendMessage(ctx, "Processamento finalizado!");

  } catch (error) {
    console.error("Erro ao bater ponto:", error);
    await bot.sendMessage(ctx, "Erro ao bater ponto:\n" + error.message);
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

module.exports = {
  aponta
};
