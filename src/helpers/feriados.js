const Holidays = require('date-holidays');
const empresa = require('./feriados-ignore-empresa');


// Brasil + Estado SP + Cidade São Paulo
const hd = new Holidays('BR', 'SP', 'sao-paulo');

function isFeriado(date = new Date()) {
  if (empresa.isIgnorado(date)) {
    return false;
  }
  return !!hd.isHoliday(date);
}

function nomeFeriado(date = new Date()) {
  const feriado = hd.isHoliday(date);
  return feriado ? feriado[0].name : null;
}

module.exports = {
  isFeriado,
  nomeFeriado
};
