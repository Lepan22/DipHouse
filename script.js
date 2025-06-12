
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

// Previsão do tempo semanal com OpenWeatherMap
async function carregarPrevisao() {
  const lat = -23.55052;
  const lon = -46.63331;
  const apiKey = 'f7ffe9a1155341c0f2a1882fb192257b'; // substitua pela sua chave se quiser
  const url = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=hourly,minutely,current,alerts&units=metric&lang=pt_br&appid=${apiKey}`;

  try {
    const res = await fetch(url);
    const data = await res.json();
    const dias = data.daily.slice(0, 7);
    const container = document.getElementById('weatherWeek');
    container.innerHTML = '';

    dias.forEach((dia, i) => {
      const dt = new Date(dia.dt * 1000);
      const nomeDia = dt.toLocaleDateString('pt-BR', { weekday: 'short' }).toUpperCase();
      const temp = `${Math.round(dia.temp.min)}° / ${Math.round(dia.temp.max)}°`;
      const icone = dia.weather[0].icon;
      const desc = dia.weather[0].description;

      const div = document.createElement('div');
      div.className = 'weather-day';
      div.innerHTML = `<div>${nomeDia}</div>
                       <img src="https://openweathermap.org/img/wn/${icone}@2x.png">
                       <div>${temp}</div>`;
      container.appendChild(div);
    });
  } catch {
    document.getElementById('weatherWeek').textContent = 'Erro ao carregar clima';
  }
}
carregarPrevisao();
