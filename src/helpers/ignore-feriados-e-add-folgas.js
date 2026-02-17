const fs = require('fs');
const path = require('path');

//const filePath = path.join(__dirname, '../data/feriados-empresa.json'); //salva dentro do src/data
const filePath = path.join(process.cwd(), 'data', 'feriados-empresa.json'); // usa pvc do aks

const dirPath = path.dirname(filePath);

if (!fs.existsSync(dirPath)) {
  fs.mkdirSync(dirPath, { recursive: true });
}

function load() {
  if (!fs.existsSync(filePath)) {
    return { ignorar: [], folgas: [] };
  }

  const db = JSON.parse(fs.readFileSync(filePath, 'utf8'));

  // compatibilidade com versão antiga
  db.ignorar ??= [];
  db.folgas ??= [];

  return db;
}

function save(data) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

function getISO(date) {
  return date.toLocaleDateString('sv-SE', {
    timeZone: 'America/Sao_Paulo'
  });
}

/* =========================
   FERIADOS IGNORADOS
========================= */

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
  return db.ignorar.includes(getISO(date));
}

/* =========================
   FOLGAS PESSOAIS
========================= */

function adicionarFolga(dataISO) {
  const db = load();

  if (!db.folgas.includes(dataISO)) {
    db.folgas.push(dataISO);
    save(db);
  }
}

function removerFolga(dataISO) {
  const db = load();
  db.folgas = db.folgas.filter(d => d !== dataISO);
  save(db);
}

function isFolga(date) {
  const db = load();
  return db.folgas.includes(getISO(date));
}

module.exports = {
  adicionar,
  remover,
  isIgnorado,

  adicionarFolga,
  removerFolga,
  isFolga
};
