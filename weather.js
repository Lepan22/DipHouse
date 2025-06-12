// Função para converter código do tempo em emoji
function weatherCodeToEmoji(code) {
  const weatherCodes = {
    0: '☀️',   // Clear sky
    1: '🌤️',   // Mainly clear
    2: '⛅',   // Partly cloudy
    3: '☁️',   // Overcast
    45: '🌫️',  // Fog
    48: '🌫️',  // Depositing rime fog
    51: '🌦️',  // Light drizzle
    53: '🌦️',  // Moderate drizzle
    55: '🌦️',  // Dense drizzle
    56: '🌧️',  // Light freezing drizzle
    57: '🌧️',  // Dense freezing drizzle
    61: '🌧️',  // Slight rain
    63: '🌧️',  // Moderate rain
    65: '🌧️',  // Heavy rain
    66: '🌧️',  // Light freezing rain
    67: '🌧️',  // Heavy freezing rain
    71: '🌨️',  // Slight snow fall
    73: '🌨️',  // Moderate snow fall
    75: '🌨️',  // Heavy snow fall
    77: '🌨️',  // Snow grains
    80: '🌦️',  // Slight rain showers
    81: '🌦️',  // Moderate rain showers
    82: '🌦️',  // Violent rain showers
    85: '🌨️',  // Slight snow showers
    86: '🌨️',  // Heavy snow showers
    95: '⛈️',  // Thunderstorm
    96: '⛈️',  // Thunderstorm with slight hail
    99: '⛈️'   // Thunderstorm with heavy hail
  };
  return weatherCodes[code] || '🌡️';
}

// Função para carregar previsão do tempo usando Open-Meteo API
async function carregarPrevisao() {
  const container = document.getElementById('weatherWeek');
  try {
    // Coordenadas de São Paulo
    const latitude = -23.5505;
    const longitude = -46.6333;
    
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=America/Sao_Paulo&forecast_days=5`;
    
    const res = await fetch(url);
    const data = await res.json();
    
    if (!data.daily) {
      throw new Error('Dados não encontrados');
    }
    
    container.innerHTML = '';
    
    // Processar os próximos 5 dias
    for (let i = 0; i < 5; i++) {
      const date = new Date(data.daily.time[i]);
      const nomeDia = date.toLocaleDateString('pt-BR', { weekday: 'short' }).toUpperCase();
      const tempMax = Math.round(data.daily.temperature_2m_max[i]);
      const tempMin = Math.round(data.daily.temperature_2m_min[i]);
      const weatherCode = data.daily.weather_code[i];
      const emoji = weatherCodeToEmoji(weatherCode);
      
      const div = document.createElement('div');
      div.className = 'weather-day';
      div.innerHTML = `
        <div>${nomeDia}</div>
        <div style="font-size:2em">${emoji}</div>
        <div>${tempMin}° / ${tempMax}°</div>
      `;
      container.appendChild(div);
    }
  } catch (error) {
    console.error('Erro ao carregar clima:', error);
    container.innerHTML = '<div class="weather-error">Erro ao carregar clima</div>';
  }
}

// Carregar previsão quando a página carregar
document.addEventListener('DOMContentLoaded', carregarPrevisao);

// Atualizar previsão a cada 30 minutos
setInterval(carregarPrevisao, 30 * 60 * 1000);

