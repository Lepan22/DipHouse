
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
    const dias = data.weather.slice(0, 3);
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

// Firebase SDK
const firebaseConfig = {
  apiKey: "AIzaSyAa_IPmOWZ4-KpWIC7huhhl7mYjYfEJhDk",
  authDomain: "diphouse-control.firebaseapp.com",
  databaseURL: "https://diphouse-control-default-rtdb.firebaseio.com",
  projectId: "diphouse-control",
  storageBucket: "diphouse-control.appspot.com",
  messagingSenderId: "126387069829",
  appId: "1:126387069829:web:7e365252a98da884075aec"
};
firebase.initializeApp(firebaseConfig);
const storage = firebase.storage();

// Carrossel de fotos
async function iniciarCarrossel() {
  const container = document.getElementById('photo');
  const img = document.createElement('img');
  container.innerHTML = '';
  container.appendChild(img);

  const fotosRef = storage.ref('fotos');
  try {
    const res = await fotosRef.listAll();
    const urls = await Promise.all(res.items.map(item => item.getDownloadURL()));
    let index = 0;
    function trocarImagem() {
      img.src = urls[index];
      index = (index + 1) % urls.length;
    }
    trocarImagem();
    setInterval(trocarImagem, 5000);
  } catch {
    img.src = 'https://via.placeholder.com/400x300?text=Sem+Fotos';
  }
}
iniciarCarrossel();
