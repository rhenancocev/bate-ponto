const fs = require('fs');
const path = require('path');
const env = require('../../config');

const crypto = require('crypto');
const ALGORITHM = 'aes-256-cbc';
const SECRET = env.CONFIG_SECRET_KEY;
const KEY = crypto.createHash('sha256').update(String(SECRET)).digest();

function encrypt(text) {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(ALGORITHM, KEY, iv);
  const encrypted = Buffer.concat([cipher.update(text, 'utf8'), cipher.final()]);
  return iv.toString('hex') + ':' + encrypted.toString('hex');
}

function decrypt(encryptedText) {
  const [ivHex, contentHex] = encryptedText.split(':');
  const iv = Buffer.from(ivHex, 'hex');
  const content = Buffer.from(contentHex, 'hex');
  const decipher = crypto.createDecipheriv(ALGORITHM, KEY, iv);
  const decrypted = Buffer.concat([decipher.update(content), decipher.final()]);
  return decrypted.toString('utf8');
}

const CONFIG_PATH = path.join(process.cwd(), 'data', 'config.json');

function ensureConfigFile() {
  const configDir = path.dirname(CONFIG_PATH);
  if (!fs.existsSync(configDir)) {
    fs.mkdirSync(configDir, { recursive: true });
  }

  if (!fs.existsSync(CONFIG_PATH)) {
    const initial = {senha: env.SENHA ? encrypt(env.SENHA) : ''};
    fs.writeFileSync(CONFIG_PATH, JSON.stringify(initial, null, 2) + '\n', 'utf-8');
  }
}

function readConfig() {
  ensureConfigFile();
  const raw = fs.readFileSync(CONFIG_PATH, 'utf-8');
  return JSON.parse(raw);
}

function getSenhaAtual() {
  const config = readConfig();
  if (!config.senha) return null;
  return decrypt(config.senha);
}

function saveNovaSenha(novaSenha) {
  const config = readConfig();
  config.senha = encrypt(novaSenha);
  fs.writeFileSync(CONFIG_PATH, JSON.stringify(config, null, 2) + '\n', 'utf-8');
}

module.exports = {
  getSenhaAtual,
  saveNovaSenha
};
