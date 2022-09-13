const env = require('../../.env');
const puppeteer = require('puppeteer');

function aponta (ctx,bot,cronJob) {(async () => {

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
    const ID_EMPRESA = env.ID_EMPRESA
    const MATRICULA = env.MATRICULA
    const SENHA = env.SENHA
  
    
      //acessando a pagina de ponto
      await page.goto(HOST);
      console.log("Acessando o site...")
  
      //incluindo id da empresa
      await page.type('[name="CD_EMPGCB_FUN"]', ID_EMPRESA);
  
      //incluindo matricula do funcionario
      await page.type('[name="CD_FUN"]', MATRICULA);
      console.log("Digitando matricula...")
  
      //incluindo senha
      await page.type('[name="CD_USRSGR_SNH_CPL"]', SENHA);
      console.log("Digitando senha...")
  
      //clica no primeiro botão processar
      await page.click('[name="NM_BOT_PRC"]');
      console.log("Logando no site...")
  
      await page.waitForNavigation();
  
      //Seleciona a opção de marcação de ponto pelo css
      await page.click('body > form:nth-child(2) > table:nth-child(3) > tbody:nth-child(1) > tr:nth-child(2) > td:nth-child(1) > select:nth-child(1) > option:nth-child(5)');
      console.log("Selecionando a marcação de ponto...")
  
      //clica no segundo botão processar
      await page.click('[name="NM_BOT_PRC"]');
      console.log("Processando...")
  
      await page.waitForNavigation();

      //clica no terceiro botão processar
      await page.click('[id="NM_BOT_PRC"]');
      console.log("Marcando ponto...")
  
      await page.waitForNavigation();
  
      //bate um print
      await page.screenshot({ path: 'ponto.png' });
      console.log("Ponto marcado com sucesso, printando...")
      bot.sendMessage(ctx, "Ponto batido com sucesso: ");
      bot.sendMediaGroup(ctx, [{type: 'photo',media: './ponto.png'}]);
  
      //clina no botão de sair
      await page.click('[id="NM_BOT_FIM"]');
  
      await browser.close();
      console.log("Fechando browser...")
      bot.sendMessage(ctx, "Processamento finalizado!");

      if(cronJob){
        process.exit(1)
      }
  
    } catch (error){
      bot.sendMessage(ctx, "Erro ao bater o ponto, log:\n\n" + error);
      await browser.close();
    }
    
  })()}

  module.exports = {
    aponta: aponta
  }