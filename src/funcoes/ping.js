const env = require('../../config');
const puppeteer = require('puppeteer');
const { getSenhaAtual } = require('../helpers/gestao-de-senha');

function ping (ctx,bot) {(async () => {

    const browser = await puppeteer.launch({ args: ['--disable-setuid-sandbox',
    '--no-sandbox',
    '--ignore-certificate-errors',
    '--disable-dev-shm-usage',
    '--disable-gpu',
    '--no-zygote',
    '--single-process'],
    executablePath: '/usr/bin/chromium',
    ignoreHTTPSErrors: true, 
    headless: true});

    const page = await browser.newPage();
    
    try{
    //configurando timeout ilimitado
    page.setDefaultNavigationTimeout(0);
    const { HOST, ID_EMPRESA, MATRICULA } = env;
    const SENHA = getSenhaAtual();
    
    //acessando a pagina de ponto
    await page.goto(HOST, { waitUntil: 'networkidle2' });

    await page.type('[name="CD_EMPGCB_FUN"]', ID_EMPRESA);
    await page.type('[name="CD_FUN"]', MATRICULA);
    await page.type('[name="CD_USRSGR_SNH_CPL"]', SENHA);

    await Promise.all([
        page.waitForNavigation({ waitUntil: 'networkidle2' }),
        page.click('[name="NM_BOT_PRC"]')
    ]);

    //bate um print
    await page.screenshot({ path: 'ping.png' });
    bot.sendMessage(ctx, "Você está conectado!");
    bot.sendMediaGroup(ctx, [{type: 'photo',media: './ping.png'}]);

    await browser.close();

    } catch (error){
    await page.screenshot({ path: 'erro.png' });
    bot.sendMessage(ctx, "SITE FORA OU SEM VPN:\n\n" + error);
    bot.sendMediaGroup(ctx, [{type: 'photo',media: './erro.png'}]);
    await browser.close();
    }
    
})()}

module.exports = {
    ping: ping
}