const feriados = require('./feriados');
const getNextBusinessDay = require('./proximo-dia-util');

function getExecutionDay(today) {
  // fim de semana ou feriado → próximo dia útil
  if (feriados.isFeriado(today)) {
    return getNextBusinessDay(today);
  }

  const diaSemana = today.getDay();
  // fim de semana
  if (diaSemana === 0 || diaSemana === 6) {
    return getNextBusinessDay(today);
  }

  // dia útil → hoje mesmo
  return today;
}

module.exports = getExecutionDay;
