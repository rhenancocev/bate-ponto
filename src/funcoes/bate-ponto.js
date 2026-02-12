const env = require('../../config');
const puppeteer = require('puppeteer');
const espera = require('./sleep');

function aponta(ctx, bot, cronJob) {
  (async () => {
    const browser = await puppeteer.launch({
      args: ['--disable-setuid-sandbox', '--no-sandbox', '--ignore-certificate-errors', '--disable-dev-shm-usage', '--disable-gpu', '--no-zygote', '--single-process'],
      //product: 'firefox',
      //executablePath: 'C:\\Program Files\\Mozilla Firefox\\firefox.exe', // Caminho para o Firefox instalado no Windows
      executablePath: '/usr/bin/chromium',
      ignoreHTTPSErrors: true,
      headless: true
    });

    const page = await browser.newPage();
    let attempt = 0;
    const maxAttempts = 3;

    async function markAttendance() {
      try {
        page.setDefaultNavigationTimeout(0);
        const HOST = env.HOST;
        const ID_EMPRESA = env.ID_EMPRESA;
        const MATRICULA = env.MATRICULA;
        const SENHA = env.SENHA;

        await page.goto(HOST);
        console.log("Acessando o site...");

        await page.type('[name="CD_EMPGCB_FUN"]', ID_EMPRESA);
        await page.type('[name="CD_FUN"]', MATRICULA);
        console.log("Digitando matricula...");

        await page.type('[name="CD_USRSGR_SNH_CPL"]', SENHA);
        console.log("Digitando senha...");

        await page.click('[name="NM_BOT_PRC"]');
        console.log("Logando no site...");

        await page.waitForNavigation();

        await page.click('body > form:nth-child(2) > table:nth-child(3) > tbody:nth-child(1) > tr:nth-child(2) > td:nth-child(1) > select:nth-child(1) > option:nth-child(5)');
        console.log("Selecionando a marcação de ponto...");

        await page.click('[name="NM_BOT_PRC"]');
        console.log("Processando...");

        await page.waitForNavigation();

        await page.click('[id="NM_BOT_PRC"]');
        console.log("Marcando ponto...");

        await page.waitForNavigation();

        await page.screenshot({ path: 'ponto.png' });
        console.log("Ponto marcado com sucesso, printando...");
        bot.sendMessage(ctx, "Ponto batido com sucesso: ");
        bot.sendMediaGroup(ctx, [{ type: 'photo', media: './ponto.png' }]);

        await page.click('[id="NM_BOT_FIM"]');
        await browser.close();
        console.log("Fechando browser...");
        bot.sendMessage(ctx, "Processamento finalizado!");

        if (cronJob) {
          bot.sendMessage(ctx, "Vamos reiniciar em 40 minutos.");
          await espera.sleep(2400000);
          process.exit(0);
        }

      } catch (error) {
        console.error("Erro ao bater o ponto, log:\n\n", error);
        bot.sendMessage(ctx, "Erro ao bater o ponto, log:\n\n" + error);
        await browser.close();

        attempt++;
        if (attempt < maxAttempts) {
          console.log(`Tentando novamente... (${attempt}/${maxAttempts})`);
          await espera.sleep(5000);
          await markAttendance();
        } else {
          console.error("Máximo de tentativas alcançado. Abortando...");
        }
      }
    }

    await markAttendance();
  })();
}

module.exports = {
  aponta: aponta
};
