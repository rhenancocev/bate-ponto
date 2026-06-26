const env = require('../../config');
const { getSenhaAtual } = require('../helpers/gestao-de-senha');
const puppeteer = require('puppeteer');
const fs = require('fs');

async function aponta(ctx, bot) {

  let browser;

  try {
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
    page.setDefaultNavigationTimeout(120000);

    const { HOST, ID_EMPRESA, MATRICULA } = env;
    const SENHA = getSenhaAtual();

    await page.goto(HOST, {
      waitUntil: 'domcontentloaded'
    });

    await page.type('[name="CD_EMPGCB_FUN"]', ID_EMPRESA);
    await page.type('[name="CD_FUN"]', MATRICULA);
    await page.type('[name="CD_USRSGR_SNH_CPL"]', SENHA);

    await page.evaluate(() => {
      const el = document.querySelector('[name="NM_BOT_PRC"]');
      if (el) el.click();
    });
    await new Promise(r => setTimeout(r, 5000));

    await page.select(
      'body > form:nth-child(2) > table:nth-child(3) > tbody:nth-child(1) > tr:nth-child(2) > td:nth-child(1) > select:nth-child(1)',
      await page.$eval(
        'body > form:nth-child(2) > table:nth-child(3) > tbody:nth-child(1) > tr:nth-child(2) > td:nth-child(1) > select:nth-child(1)',
        select => select.options[4].value
      )
    );

    await page.evaluate(() => {
      const el = document.querySelector('[name="NM_BOT_PRC"]');
      if (el) el.click();
    });
    await new Promise(r => setTimeout(r, 5000));

    await page.evaluate(() => {
      const el = document.querySelector('#NM_BOT_PRC');
      if (el) el.click();
    });
    await new Promise(r => setTimeout(r, 5000));

    await page.screenshot({ path: 'ponto.png' });
    await bot.sendMessage(ctx, 'Ponto batido com sucesso:');
    await bot.sendMediaGroup(ctx, [
      {
        type: 'photo',
        media: fs.createReadStream('ponto.png')
      }
    ]);

    await page.evaluate(() => {
      const el = document.querySelector('#NM_BOT_FIM');
      if (el) el.click();
    });
    await bot.sendMessage(ctx, 'Processamento finalizado!');

  } catch (error) {
    console.error('Erro ao bater ponto:', error);
    await bot.sendMessage(
      ctx,
      'Erro ao bater ponto:\n' + error.message
    );
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

module.exports = {
  aponta
};