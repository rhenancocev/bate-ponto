const env = require('../../.env');
const puppeteer = require('puppeteer');

function ping (ctx,bot) {(async () => {

    const browser = await puppeteer.launch({ args: ['--disable-setuid-sandbox',
    '--no-sandbox',
    '--ignore-certificate-errors'],
    product: 'firefox', 
    ignoreHTTPSErrors: true, 
    headless: true});

    const page = await browser.newPage();
    
    try{
    //configurando timeout ilimitado
    page.setDefaultNavigationTimeout(0);
    const HOST = env.HOST
    
    //acessando a pagina de ponto
    await page.goto(HOST);

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