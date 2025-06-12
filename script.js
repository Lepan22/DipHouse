
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

function climaParaEmoji(texto) {
  texto = texto.toLowerCase();
  if (texto.includes('sun') || texto.includes('sol')) return '☀️';
  if (texto.includes('cloud') || texto.includes('nublado')) return '☁️';
  if (texto.includes('rain') || texto.includes('chuva')) return '🌧️';
  if (texto.includes('storm') || texto.includes('tempest')) return '⛈️';
  if (texto.includes('snow') || texto.includes('neve')) return '❄️';
  return '🌡️';
}

async function carregarPrevisao() {
  const container = document.getElementById('weatherWeek');
  try {
    const res = await fetch('https://wttr.in/Sao+Paulo?format=j1');
    const data = await res.json();
    const dias = data.weather.slice(0, 3); // hoje, amanhã, depois

    container.innerHTML = '';

    dias.forEach((dia) => {
      const dataObj = new Date(dia.date);
      const nomeDia = dataObj.toLocaleDateString('pt-BR', { weekday: 'short' }).toUpperCase();
      const temp = `${dia.mintempC}° / ${dia.maxtempC}°`;
      const desc = dia.hourly[4].weatherDesc[0].value;
      const emoji = climaParaEmoji(desc);

      const div = document.createElement('div');
      div.className = 'weather-day';
      div.innerHTML = `<div>${nomeDia}</div>
                       <div style="font-size:2em">${emoji}</div>
                       <div>${temp}</div>`;
      container.appendChild(div);
    });
  } catch {
    container.textContent = 'Erro ao carregar clima';
  }
}
carregarPrevisao();
