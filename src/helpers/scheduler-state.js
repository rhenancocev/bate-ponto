let modoAtual = 'normal';
let agendaAtiva = false;
let diaAgendado = null;

// ---------- MODO ----------
function setModo(modo) {
  modoAtual = modo;
}

function getModo() {
  return modoAtual;
}

// ---------- LOCK ----------
function iniciarAgenda(dia) {
  agendaAtiva = true;
  diaAgendado = dia;
}

function finalizarAgenda() {
  agendaAtiva = false;
  diaAgendado = null;
}

function isAgendaAtiva() {
  return agendaAtiva;
}

function getDiaAgendado() {
  return diaAgendado;
}

module.exports = {
  setModo,
  getModo,
  iniciarAgenda,
  finalizarAgenda,
  isAgendaAtiva,
  getDiaAgendado
};
