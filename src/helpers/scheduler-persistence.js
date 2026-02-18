const fs = require('fs');
const path = require('path');

const filePath = path.join(process.cwd(), 'data', 'scheduler-state.json');

function salvar(state) {
  fs.writeFileSync(filePath, JSON.stringify(state, null, 2));
}

function carregar() {
  if (!fs.existsSync(filePath)) {
    return null;
  }

  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch {
    return null;
  }
}

function limpar() {
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }
}

function existeEstado() {
  return fs.existsSync(filePath);
}

module.exports = {
  salvar,
  carregar,
  limpar,
	existeEstado
};
