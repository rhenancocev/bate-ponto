const feriados = require('./feriados');

function isWeekend(date) {
  const day = date.getDay();
  return day === 0 || day === 6;
}

function getNextBusinessDay(fromDate = new Date()) {
  const date = new Date(fromDate);

  while (true) {
    date.setDate(date.getDate() + 1);

    if (isWeekend(date)) continue;
    if (feriados.isFeriado(date)) continue;

    return date;
  }
}

module.exports = getNextBusinessDay;
