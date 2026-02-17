const Holidays = require('date-holidays');
const empresa = require('./ignore-feriados-e-add-folgas');

// Brasil + Estado SP + Cidade São Paulo
const hd = new Holidays('BR', 'SP', 'sao-paulo');

function isFeriado(date = new Date()) {

  // PRIORIDADE 1 — folga pessoal
  if (empresa.isFolga(date)) {
    return true;
  }

  // PRIORIDADE 2 — empresa trabalha mesmo sendo feriado
  if (empresa.isIgnorado(date)) {
    return false;
  }

  // calendário oficial
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
