montarMenu("chamados");

const id = new URLSearchParams(location.search).get("id");
let chamado = null;
let tecnicos = [];

async function carregar() {
  if (!id) {
    mostrarAlerta("warning", 'Nenhum chamado informado. Volte para a <a href="chamados.html">lista</a>.');
    return;
  }
  try {
    const dados = await Promise.all([
      get("/chamados/" + id),
      get("/chamados/" + id + "/comentarios"),
      get("/tecnicos")
    ]);
    chamado = dados[0];
    tecnicos = listaDe(dados[2]);
    desenharDados();
    desenharAcoes();
    desenharComentarios(listaDe(dados[1]));
  } catch (e) {
    mostrarErro(e);
  }
}

//Dados dos chamados
function desenharDados() {
  definirHtml("dados",
    '<div class="card"><div class="card-body">' +
    '<div class="d-flex justify-content-between align-items-start flex-wrap gap-2">' +
    '<h1 class="h4 mb-0">#' + chamado.id + " - " + esc(chamado.titulo) + '</h1>' +
    '<div>' + seloPrioridade(chamado.prioridade) + " " + seloStatus(chamado.status) + '</div></div>' +
    '<p class="texto-quebra mt-3">' + esc(chamado.descricao) + '</p>' +
    '<dl class="row mb-0">' +
    '<dt class="col-sm-3">Cliente</dt><dd class="col-sm-9"><a href="chamados.html?clienteId=' + chamado.clienteId + '">' + esc(chamado.clienteNome) + '</a></dd>' +
    '<dt class="col-sm-3">Categoria</dt><dd class="col-sm-9">' + esc(chamado.categoriaNome) + '</dd>' +
    '<dt class="col-sm-3">Técnico</dt><dd class="col-sm-9">' + (chamado.tecnicoNome ? esc(chamado.tecnicoNome) : '<span class="text-muted">Sem técnico</span>') + '</dd>' +
    '<dt class="col-sm-3">Abertura</dt><dd class="col-sm-9">' + formatarData(chamado.dataAbertura) + '</dd>' +
    '<dt class="col-sm-3">Fechamento</dt><dd class="col-sm-9">' + formatarData(chamado.dataFechamento) + '</dd>' +
    '</dl></div></div>');
}
function desenharAcoes() {
  if (CONFIG.statusFinais.indexOf(chamado.status) >= 0) {
    definirHtml("acoes", '<div class="alert alert-secondary mb-0">Este chamado está ' + esc(chamado.status) +
      ': não é possível alterar status ou técnico.</div>');
    return;
  }

  const outrosStatus = CONFIG.statusChamado
    .filter(function (s) { return s !== chamado.status; })
    .map(function (s) { return { valor: s, texto: s }; });
  const opcoesTecnicos = tecnicos.map(function (t) { return { valor: t.id, texto: t.nome }; });

  definirHtml("acoes",
    '<div class="row g-3">' +
    '<div class="col-md-6"><form id="form-status" class="card card-body">' +
    '<label class="form-label" for="novo-status">Alterar status</label>' +
    '<div class="input-group"><select class="form-select" id="novo-status" required>' +
    opcoesHtml(outrosStatus, "", "Selecione...") + '</select>' +
    '<button class="btn btn-primary" type="submit">Alterar</button></div></form></div>' +
    '<div class="col-md-6"><form id="form-tecnico" class="card card-body">' +
    '<label class="form-label" for="novo-tecnico">Atribuir técnico</label>' +
    '<div class="input-group"><select class="form-select" id="novo-tecnico" required>' +
    opcoesHtml(opcoesTecnicos, chamado.tecnicoId, "Selecione...") + '</select>' +
    '<button class="btn btn-primary" type="submit">Atribuir</button></div></form></div></div>');

  document.getElementById("form-status").addEventListener("submit", alterarStatus);
  document.getElementById("form-tecnico").addEventListener("submit", atribuirTecnico);
}

async function alterarStatus(ev) {
  ev.preventDefault();
  try {
    await patch("/chamados/" + id + "/status", { status: valorDe("novo-status") });
    await carregar();
    mostrarSucesso("Status alterado.");
  } catch (e) {
    mostrarErro(e);
  }
}

async function atribuirTecnico(ev) {
  ev.preventDefault();
  try {
    await patch("/chamados/" + id + "/" + CONFIG.rotaAtribuirTecnico, { tecnicoId: Number(valorDe("novo-tecnico")) });
    await carregar();
    mostrarSucesso("Técnico atribuído.");
  } catch (e) {
    mostrarErro(e);
  }
}

function desenharComentarios(lista) {
  if (lista.length === 0) {
    definirHtml("lista-comentarios", '<li class="list-group-item text-muted">Nenhum comentário ainda.</li>');
    return;
  }
  definirHtml("lista-comentarios", lista.map(function (c) {
    return '<li class="list-group-item d-flex justify-content-between align-items-start gap-2">' +
      '<div><strong>' + esc(c.autor) + '</strong> <small class="text-muted">' + formatarData(c.data) + '</small>' +
      '<div class="texto-quebra">' + esc(c.texto) + '</div></div>' +
      '<button class="btn btn-sm btn-outline-danger" data-comentario="' + c.id + '">Excluir</button></li>';
  }).join(""));
}

document.getElementById("form-comentario").addEventListener("submit", async function (ev) {
  ev.preventDefault();
  const autor = valorDe("comentario-autor");
  try {
    await post("/chamados/" + id + "/comentarios", { texto: valorDe("comentario-texto"), autor: autor });
    localStorage.setItem("autorComentario", autor); // lembra o nome para o próximo comentário
    document.getElementById("comentario-texto").value = "";
    await carregar();
  } catch (e) {
    mostrarErro(e);
  }
});

document.getElementById("lista-comentarios").addEventListener("click", async function (ev) {
  const botao = ev.target.closest("button[data-comentario]");
  if (!botao || !confirm("Excluir este comentário?")) { return; }
  try {
    await del("/chamados/" + id + "/comentarios/" + botao.dataset.comentario);
    await carregar();
  } catch (e) {
    mostrarErro(e);
  }
});

document.getElementById("comentario-autor").value = localStorage.getItem("autorComentario") || "";
carregar();