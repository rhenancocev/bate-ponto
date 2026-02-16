function capitalize(text) {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

function formatarDataBR(date) {
  return capitalize(
    date.toLocaleDateString('pt-BR', {
      weekday: 'long',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      timeZone: 'America/Sao_Paulo'
    })
  );
}

module.exports = formatarDataBR;
