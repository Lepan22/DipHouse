// Versão compatível com iPad 2 - sem ES6+ features
function weatherCodeToEmoji(code) {
  var weatherCodes = {
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

// Função para fazer requisição AJAX compatível com navegadores antigos
function makeRequest(url, callback) {
  var xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function() {
    if (xhr.readyState === 4) {
      if (xhr.status === 200) {
        try {
          var data = JSON.parse(xhr.responseText);
          callback(null, data);
        } catch (e) {
          callback(e, null);
        }
      } else {
        callback(new Error('Erro na requisição: ' + xhr.status), null);
      }
    }
  };
  xhr.open('GET', url, true);
  xhr.send();
}

// Função para carregar previsão do tempo - compatível com iPad 2
function carregarPrevisao() {
  var container = document.getElementById('weatherWeek');
  if (!container) return;
  
  // Coordenadas de São Paulo
  var latitude = -23.5505;
  var longitude = -46.6333;
  
  var url = 'https://api.open-meteo.com/v1/forecast?latitude=' + latitude + 
            '&longitude=' + longitude + 
            '&daily=weather_code,temperature_2m_max,temperature_2m_min' +
            '&timezone=America/Sao_Paulo&forecast_days=5';
  
  makeRequest(url, function(error, data) {
    if (error || !data || !data.daily) {
      console.error('Erro ao carregar clima:', error);
      container.innerHTML = '<div class="weather-error">Erro ao carregar clima</div>';
      return;
    }
    
    container.innerHTML = '';
    
    // Processar os próximos 5 dias
    for (var i = 0; i < 5; i++) {
      var date = new Date(data.daily.time[i]);
      var nomeDia = ['DOM', 'SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SAB'][date.getDay()];
      var tempMax = Math.round(data.daily.temperature_2m_max[i]);
      var tempMin = Math.round(data.daily.temperature_2m_min[i]);
      var weatherCode = data.daily.weather_code[i];
      var emoji = weatherCodeToEmoji(weatherCode);
      
      var div = document.createElement('div');
      div.className = 'weather-day';
      div.innerHTML = '<div>' + nomeDia + '</div>' +
                      '<div style="font-size:2em">' + emoji + '</div>' +
                      '<div>' + tempMin + '° / ' + tempMax + '°</div>';
      container.appendChild(div);
    }
  });
}

// Inicializar quando a página carregar - compatível com navegadores antigos
if (document.addEventListener) {
  document.addEventListener('DOMContentLoaded', carregarPrevisao);
} else if (document.attachEvent) {
  document.attachEvent('onreadystatechange', function() {
    if (document.readyState === 'complete') {
      carregarPrevisao();
    }
  });
}

// Atualizar previsão a cada 30 minutos
setInterval(carregarPrevisao, 30 * 60 * 1000);

