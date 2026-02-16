const feriados = require('./feriados');
const getNextBusinessDay = require('./proximo-dia-util');

function aindaTemExecucaoHoje(date) {
  const now = new Date(date);

  // último horário possível (ex: 19h)
  const limite = new Date(date);
  limite.setHours(19, 0, 0, 0);

  return now < limite;
}

function getExecutionDay(today) {

  // fim de semana ou feriado → próximo dia útil
  if (feriados.isFeriado(today)) {
    return getNextBusinessDay(today);
  }

  const diaSemana = today.getDay();
  if (diaSemana === 0 || diaSemana === 6) {
    return getNextBusinessDay(today);
  }

  // ainda dá tempo hoje?
  if (aindaTemExecucaoHoje(today)) {
    return today;
  }

  // senão vai pro próximo dia útil
  return getNextBusinessDay(today);
}

module.exports = getExecutionDay;
