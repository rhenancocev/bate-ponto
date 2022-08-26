const CronJob = require('cron').CronJob
const bate_ponto = require('./bate-ponto')
const random = require('./random')

const min_entrada = 0;
const max_entrada = 35;
const min_saida = 48;
const max_saida = 52;
const min_almoco = 1;
const max_almoco = 51;
var hora_saida = 18;
var cron_entrada = random.between(min_entrada,max_entrada);
var cron_saida = random.between(min_saida,max_saida);
var minuto_saida = cron_entrada + cron_saida;
var cron_entrada_almoco = random.between(min_almoco,max_almoco);
var minuto_saida_almoco = (cron_entrada_almoco + 62) % 60;

if(minuto_saida >= 60){
  hora_saida += 1;
  minuto_saida = (cron_entrada+cron_saida) % 60
}

console.log('Sua entrada vai ser 9:' + cron_entrada);
console.log('Sua entrada do almoço vai ser 12:'+ cron_entrada_almoco);
console.log('Sua saida do almoço vai ser 13:'+ minuto_saida_almoco);
console.log('Sua saida vai ser '+ hora_saida + ':' + minuto_saida);
console.log('===================== AGUARDANDO SCHEDULE =====================')

const entrada = new CronJob(cron_entrada + ' 9 * * 1-5', () => {
  console.log('Iniciando cronJOB para bater o ponto de entrada as 09:'+cron_entrada)
  bate_ponto.aponta()
}, null, true, 'America/Sao_Paulo')

const almoco = new CronJob(cron_entrada_almoco + ' 12 * * 1-5', () => {
  console.log('Iniciando cronJOB para bater o ponto de entrada do almoço as 12:' + cron_entrada_almoco)
  bate_ponto.aponta()
}, null, true, 'America/Sao_Paulo')

const volta_almoco = new CronJob(minuto_saida_almoco + ' 13 * * 1-5', () => {
  console.log('Iniciando cronJOB para bater o ponto de saida do almoço as 13:' + minuto_saida_almoco)
  bate_ponto.aponta()
}, null, true, 'America/Sao_Paulo')

const saida = new CronJob(minuto_saida + ' ' + hora_saida + ' * * 1-5', () => {
  console.log('Iniciando cronJOB para bater o ponto de saida as ' + hora_saida + ':' + minuto_saida)
  bate_ponto.aponta()
  process.exit(1)
}, null, true, 'America/Sao_Paulo')