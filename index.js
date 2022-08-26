const CronJob = require('cron').CronJob
const bate_ponto = require('./bate-ponto')
const random = require('./random')

const min_entrada = 0
const max_entrada = 35
const min_saida = 48
const max_saida = 52
var hora_saida = 18
var cron_entrada = random.between(min_entrada,max_entrada)
var cron_saida = random.between(min_saida,max_saida)
var minuto_saida = cron_entrada + cron_saida

if(minuto_saida>=60){
  hora_saida += 1;
  minuto_saida = (cron_entrada+cron_saida) % 60
}

console.log('sua entrada vai ser 9:'+cron_entrada);
console.log('sua saida vai ser '+ hora_saida+':'+minuto_saida);

const entrada = new CronJob(cron_entrada+' 9 * * 1-5', () => {
  console.log('Iniciando cronJOB para bater o ponto de entrada as 09:'+cron_entrada)
  bate_ponto.aponta()
}, null, true, 'America/Sao_Paulo')

const almoco = new CronJob('10 12 * * 1-5', () => {
  console.log('Iniciando cronJOB para bater o ponto do almoço as 12:10')
  bate_ponto.aponta()
}, null, true, 'America/Sao_Paulo')

const volta_almoco = new CronJob('11 13 * * 1-5', () => {
  console.log('Iniciando cronJOB para bater o ponto da volta do almoço as 13:11')
  bate_ponto.aponta()
}, null, true, 'America/Sao_Paulo')

const saida = new CronJob(minuto_saida+' '+hora_saida+' * * 1-5', () => {
  console.log('Iniciando cronJOB para bater o ponto de saida as 18:'+minuto_saida)
  bate_ponto.aponta()
  process.exit(1)
}, null, true, 'America/Sao_Paulo')