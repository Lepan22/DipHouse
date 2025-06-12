
function updateClock() {
  const now = new Date();
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  document.getElementById('clock').textContent = `${hours}:${minutes}`;

  const greeting = now.getHours() < 12 ? 'Bom dia' :
                   now.getHours() < 18 ? 'Boa tarde' : 'Boa noite';
  document.getElementById('greeting').textContent = greeting;
}
setInterval(updateClock, 1000);
updateClock();

async function carregarPrevisao() {
  const container = document.getElementById('weatherWeek');
  try {
    const res = await fetch('https://wttr.in/Sao+Paulo?format=j1');
    const data = await res.json();
    const dias = data.weather.slice(0, 4);
    container.innerHTML = '';

    dias.forEach((dia, i) => {
      const dataObj = new Date(dia.date);
      const nomeDia = dataObj.toLocaleDateString('pt-BR', { weekday: 'short' }).toUpperCase();
      const temp = `${dia.mintempC}° / ${dia.maxtempC}°`;
      const icone = dia.hourly[4].weatherIconUrl[0].value;
      const desc = dia.hourly[4].weatherDesc[0].value;

      const div = document.createElement('div');
      div.className = 'weather-day';
      div.innerHTML = `<div>${nomeDia}</div>
                       <img src="${icone}">
                       <div>${temp}</div>`;
      container.appendChild(div);
    });
  } catch {
    container.textContent = 'Erro ao carregar clima';
  }
}
carregarPrevisao();
