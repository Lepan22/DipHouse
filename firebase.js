<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Gestão do Painel</title>
  <script type="module">
    import {
      db, ref, push, update, remove, onValue,
      storage, sRef, uploadBytes, getDownloadURL, deleteObject
    } from './firebase.js';

    window.addEventListener('DOMContentLoaded', () => {
      // EVENTO
      document.getElementById('salvarEventoBtn').addEventListener('click', () => {
        const dia = document.getElementById('eventoData').value.trim();
        const texto = document.getElementById('eventoTexto').value.trim();
        if (dia && texto) {
          push(ref(db, 'eventos'), { dia, texto });
          document.getElementById('eventoData').value = '';
          document.getElementById('eventoTexto').value = '';
        }
      });

      onValue(ref(db, 'eventos'), snap => {
        const container = document.getElementById('listaEventos');
        container.innerHTML = '';
        snap.forEach(child => {
          const { dia, texto } = child.val();
          const div = document.createElement('div');
          div.className = 'item';
          div.innerHTML = `
            <strong>${dia}</strong>: ${texto}<br>
            <button onclick="editarEvento('${child.key}', '${dia}', \`${texto}\`)">Editar</button>
            <button onclick="removerItem('eventos', '${child.key}')">Excluir</button>
          `;
          container.appendChild(div);
        });
      });

      window.editarEvento = (key, dia, texto) => {
        const novoDia = prompt("Nova data:", dia);
        const novoTexto = prompt("Nova descrição:", texto);
        if (novoDia && novoTexto) {
          update(ref(db, 'eventos/' + key), { dia: novoDia, texto: novoTexto });
        }
      };

      // TAREFA
      document.getElementById('salvarTarefaBtn').addEventListener('click', () => {
        const texto = document.getElementById('tarefaTexto').value.trim();
        if (texto) {
          push(ref(db, 'tarefas'), { texto, concluida: false });
          document.getElementById('tarefaTexto').value = '';
        }
      });

      onValue(ref(db, 'tarefas'), snap => {
        const container = document.getElementById('listaTarefas');
        container.innerHTML = '';
        snap.forEach(child => {
          const { texto, concluida } = child.val();
          const div = document.createElement('div');
          div.className = 'item';
          div.innerHTML = `
            ${concluida ? '<s>' + texto + '</s>' : texto}<br>
            <button onclick="toggleConclusao('${child.key}', ${!concluida})">${concluida ? 'Desfazer' : 'Concluir'}</button>
            <button onclick="removerItem('tarefas', '${child.key}')">Excluir</button>
          `;
          container.appendChild(div);
        });
      });

      window.toggleConclusao = (key, status) => {
        update(ref(db, 'tarefas/' + key), { concluida: status });
      };

      // FOTOS
      document.getElementById('uploadFotosBtn').addEventListener('click', () => {
        const files = document.getElementById('fotoInput').files;
        Array.from(files).forEach(file => {
          const caminho = 'fotos/' + file.name;
          const storageRef = sRef(storage, caminho);
          uploadBytes(storageRef, file).then(() => {
            getDownloadURL(storageRef).then(url => {
              push(ref(db, 'fotos'), { url, path: caminho });
            });
          });
        });
      });

      onValue(ref(db, 'fotos'), snap => {
        const galeria = document.getElementById('galeria');
        galeria.innerHTML = '';
        snap.forEach(child => {
          const { url, path } = child.val();
          const div = document.createElement('div');
          div.className = 'foto-box';
          div.innerHTML = `
            <img src="${url}" alt="foto" />
            <button onclick="removerFoto('${child.key}', '${path}')">X</button>
          `;
          galeria.appendChild(div);
        });
      });

      // Utilitários globais
      window.removerItem = (colecao, key) => remove(ref(db, `${colecao}/${key}`));
      window.removerFoto = (key, path) => {
        remove(ref(db, 'fotos/' + key));
        deleteObject(sRef(storage, path));
      };
    });
  </script>

  <style>
    body { font-family: sans-serif; background: #111; color: #fff; padding: 20px; }
    h2 { margin-top: 30px; }
    input, textarea, button {
      padding: 8px;
      margin: 5px 0;
      width: 100%;
      border-radius: 5px;
      border: none;
    }
    .item {
      background: #222;
      padding: 10px;
      border-radius: 5px;
      margin: 5px 0;
    }
    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
      gap: 15px;
    }
    .foto-box {
      position: relative;
    }
    .foto-box button {
      position: absolute;
      top: 5px;
      right: 5px;
      background: rgba(255, 0, 0, 0.7);
      border: none;
      padding: 4px;
      cursor: pointer;
    }
    img {
      width: 100%;
      height: 150px;
      object-fit: cover;
      border-radius: 5px;
    }
  </style>
</head>
<body>
  <h1>Gestão do Painel</h1>

  <h2>Adicionar Evento</h2>
  <input type="text" id="eventoData" placeholder="Data (DD/MM/AAAA)">
  <textarea id="eventoTexto" placeholder="Descrição do evento"></textarea>
  <button id="salvarEventoBtn">Salvar Evento</button>
  <div id="listaEventos"></div>

  <h2>Adicionar Tarefa</h2>
  <input type="text" id="tarefaTexto" placeholder="Tarefa">
  <button id="salvarTarefaBtn">Salvar Tarefa</button>
  <div id="listaTarefas"></div>

  <h2>Upload de Fotos</h2>
  <input type="file" id="fotoInput" multiple accept="image/*">
  <button id="uploadFotosBtn">Enviar Fotos</button>
  <div class="grid" id="galeria"></div>
</body>
</html>
