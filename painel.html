<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Painel de Controle</title>
  <script type="module">
    import {
      db, ref, push, update, remove, onValue,
      storage, sRef, uploadBytes, getDownloadURL, deleteObject
    } from './firebase.js';

    const $ = (id) => document.getElementById(id);

    $('btnAddEvento').onclick = () => {
      const dia = $('eventoData').value.trim();
      const texto = $('eventoTexto').value.trim();
      if (dia && texto) {
        push(ref(db, 'eventos'), { dia, texto });
        $('eventoData').value = '';
        $('eventoTexto').value = '';
      }
    };

    onValue(ref(db, 'eventos'), snap => {
      const el = $('listaEventos');
      el.innerHTML = '';
      snap.forEach(child => {
        const { dia, texto } = child.val();
        el.innerHTML += `<div>${dia} — ${texto}
          <button onclick="editarEvento('${child.key}', '${dia}', \`${texto}\`)">Editar</button>
          <button onclick="removerItem('eventos', '${child.key}')">Excluir</button>
        </div>`;
      });
    });

    window.editarEvento = (key, dia, texto) => {
      const novoDia = prompt('Nova data:', dia);
      const novoTexto = prompt('Novo texto:', texto);
      if (novoDia && novoTexto) {
        update(ref(db, `eventos/${key}`), { dia: novoDia, texto: novoTexto });
      }
    };

    $('btnAddTarefa').onclick = () => {
      const texto = $('tarefaTexto').value.trim();
      if (texto) {
        push(ref(db, 'tarefas'), { texto, concluida: false });
        $('tarefaTexto').value = '';
      }
    };

    onValue(ref(db, 'tarefas'), snap => {
      const el = $('listaTarefas');
      el.innerHTML = '';
      snap.forEach(child => {
        const { texto, concluida } = child.val();
        el.innerHTML += `<div>${concluida ? `<s>${texto}</s>` : texto}
          <button onclick="toggleConclusao('${child.key}', ${!concluida})">
            ${concluida ? 'Desfazer' : 'Concluir'}
          </button>
          <button onclick="removerItem('tarefas', '${child.key}')">Excluir</button>
        </div>`;
      });
    });

    window.toggleConclusao = (key, status) => 
      update(ref(db, `tarefas/${key}`), { concluida: status });

    $('btnUploadFoto').onclick = () => {
      const files = $('fotoInput').files;
      Array.from(files).forEach(file => {
        const path = 'fotos/' + Date.now() + '-' + file.name;
        const fileRef = sRef(storage, path);
        uploadBytes(fileRef, file)
          .then(() => getDownloadURL(fileRef))
          .then(url => push(ref(db, 'fotos'), { url, path }))
          .then(() => console.log('Foto salva com sucesso'))
          .catch(err => console.error('Erro ao salvar foto:', err));
      });
    };

    onValue(ref(db, 'fotos'), snap => {
      const galeria = $('listaFotos');
      galeria.innerHTML = '';
      snap.forEach(child => {
        const { url, path } = child.val();
        galeria.innerHTML += `<div>
          <img src="${url}" width="150">
          <button onclick="removerFoto('${child.key}', '${path}')">Excluir</button>
        </div>`;
      });
    });

    window.removerItem = (colecao, key) => 
      remove(ref(db, `${colecao}/${key}`));

    window.removerFoto = (key, path) => {
      remove(ref(db, `fotos/${key}`));
      deleteObject(sRef(storage, path));
    };
  </script>

  <style>
    body { background: #111; color: #fff; font-family: sans-serif; padding:
