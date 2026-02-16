const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../data/feriados-empresa.json');

const dirPath = path.dirname(filePath);

if (!fs.existsSync(dirPath)) {
  fs.mkdirSync(dirPath, { recursive: true });
}

function load() {
  if (!fs.existsSync(filePath)) {
    return { ignorar: [] };
  }
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function save(data) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

function adicionar(dataISO) {
  const db = load();

  if (!db.ignorar.includes(dataISO)) {
    db.ignorar.push(dataISO);
    save(db);
  }
}

function remover(dataISO) {
  const db = load();
  db.ignorar = db.ignorar.filter(d => d !== dataISO);
  save(db);
}

function isIgnorado(date) {
  const db = load();
  const iso = date.toLocaleDateString('sv-SE', {
    timeZone: 'America/Sao_Paulo'
  });
  return db.ignorar.includes(iso);
}

module.exports = {
  adicionar,
  remover,
  isIgnorado
};
