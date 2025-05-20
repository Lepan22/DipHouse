import { db, ref, onValue, storage, sRef, listAll, getDownloadURL } from './firebase.js';

// Atualiza relógio e saudação
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

// Clima via wttr.in
async function fetchWeather() {
  try {
    const response = await fetch('https://wttr.in/Sao+Paulo?format=%t %C');
    const text = await response.text();
    document.getElementById('weatherContent').textContent = text;
  } catch {
    document.getElementById('weatherContent').textContent = 'Erro ao carregar clima';
  }
}
fetchWeather();

// Lista de tarefas
onValue(ref(db, "tarefas"), (snapshot) => {
  const list = document.getElementById("taskList");
  list.innerHTML = "";
  snapshot.forEach(item => {
    const li = document.createElement("li");
    li.textContent = item.val().texto;
    list.appendChild(li);
  });
});

// Agenda do dia
function getTodayStr() {
  const today = new Date();
  const d = String(today.getDate()).padStart(2, '0');
  const m = String(today.getMonth() + 1).padStart(2, '0');
  const y = today.getFullYear();
  return `${d}/${m}/${y}`;
}

onValue(ref(db, "eventos"), (snapshot) => {
  const list = document.getElementById("agendaList");
  list.innerHTML = "";
  const hoje = getTodayStr();
  snapshot.forEach(item => {
    const { dia, texto } = item.val();
    if (dia === hoje) {
      const li = document.createElement("li");
      li.textContent = texto;
      list.appendChild(li);
    }
  });
});

// Carrossel de fotos
async function iniciarCarrossel() {
  const container = document.getElementById('photo');
  const img = document.createElement('img');
  container.innerHTML = '';
  container.appendChild(img);

  const fotosRef = sRef(storage, 'fotos');
  try {
    const res = await listAll(fotosRef);
    const urls = await Promise.all(res.items.map(getDownloadURL));
    let index = 0;
    function trocarImagem() {
      img.src = urls[index];
      index = (index + 1) % urls.length;
    }
    trocarImagem();
    setInterval(trocarImagem, 5000);
  } catch {
    img.src = 'fotos/foto1.png';
  }
}
iniciarCarrossel();

// Renderiza calendário simples
function renderCalendar() {
  const calendarEl = document.getElementById('calendarContent');
  const now = new Date();
  const month = now.toLocaleString('pt-BR', { month: 'long' });
  const year = now.getFullYear();
  const days = new Date(year, now.getMonth() + 1, 0).getDate();
  const today = now.getDate();

  let html = `<strong>${month.toUpperCase()} ${year}</strong><br><br>`;
  for (let i = 1; i <= days; i++) {
    html += i === today ? `<b>[${i}]</b> ` : `${i} `;
  }
  calendarEl.innerHTML = html;
}
renderCalendar();
