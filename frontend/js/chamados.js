montarMenu("chamados");

let clientes = [];
let categorias = [];
let tecnicos = [];
let chamados = [];
let editandoId = null;

const modal = new bootstrap.Modal(document.getElementById("modal-chamado"));

async function iniciar() {
  try {
    const listas = await Promise.all([get("/clientes"), get("/categorias"), get("/tecnicos")]);
    clientes = listaDe(listas[0]);
    categorias = listaDe(listas[1]);
    tecnicos = listaDe(listas[2]);
  } catch (e) {
    mostrarErro(e);
    return;
  }
  preencherSelects();
  aplicarFiltrosDaUrl();
  await carregarChamados();
}

function preencherSelects() {
  const status = CONFIG.statusChamado.map(function (s) { return { valor: s, texto: s }; });
  const prioridades = CONFIG.prioridades.map(function (p) { return { valor: p, texto: p }; });
  const opcoesClientes = clientes.map(function (c) { return { valor: c.id, texto: c.nome }; });
  const opcoesCategorias = categorias.map(function (c) { return { valor: c.id, texto: c.nome }; });
  const opcoesTecnicos = tecnicos.map(function (t) { return { valor: t.id, texto: t.nome }; });

  // filtros
  definirHtml("filtro-status", opcoesHtml(status, "", "Todos os status"));
  definirHtml("filtro-prioridade", opcoesHtml(prioridades, "", "Todas as prioridades"));
  definirHtml("filtro-cliente", opcoesHtml(opcoesClientes, "", "Todos os clientes"));
  definirHtml("filtro-categoria", opcoesHtml(opcoesCategorias, "", "Todas as categorias"));
  definirHtml("filtro-tecnico", opcoesHtml(opcoesTecnicos, "", "Todos os técnicos"));

  // formulário
  definirHtml("campo-prioridade", opcoesHtml(prioridades, "", "Selecione..."));
  definirHtml("campo-cliente", opcoesHtml(opcoesClientes, "", "Selecione..."));
  definirHtml("campo-categoria", opcoesHtml(opcoesCategorias, "", "Selecione..."));
  definirHtml("campo-tecnico", opcoesHtml(opcoesTecnicos, "", "Sem técnico"));
}

//Permite abrir a lista já filtrada
function aplicarFiltrosDaUrl() {
  const params = new URLSearchParams(location.search);
  [["status", "filtro-status"], ["prioridade", "filtro-prioridade"], ["clienteId", "filtro-cliente"],
  ["categoriaId", "filtro-categoria"], ["tecnicoId", "filtro-tecnico"]].forEach(function (par) {
    if (params.get(par[0])) { document.getElementById(par[1]).value = params.get(par[0]); }
  });
}

async function carregarChamados() {
  const params = new URLSearchParams();
  [["status", "filtro-status"], ["prioridade", "filtro-prioridade"], ["clienteId", "filtro-cliente"],
  ["categoriaId", "filtro-categoria"], ["tecnicoId", "filtro-tecnico"]].forEach(function (par) {
    const valor = document.getElementById(par[1]).value;
    if (valor) { params.set(par[0], valor); }
  });
  params.set("size", "200");

  try {
    chamados = listaDe(await get("/chamados?" + params.toString())).sort(function (a, b) { return b.id - a.id; });
    desenharTabela();
  } catch (e) {
    mostrarErro(e);
  }
}

function desenharTabela() {
  const corpo = document.getElementById("tabela-corpo");
  if (chamados.length === 0) {
    corpo.innerHTML = '<tr><td colspan="9" class="text-center text-muted py-4">Nenhum chamado encontrado.</td></tr>';
    return;
  }
  corpo.innerHTML = chamados.map(function (c) {
    return "<tr><td>" + c.id + "</td>" +
      '<td><a href="chamado.html?id=' + c.id + '">' + esc(c.titulo) + "</a></td>" +
      "<td>" + esc(c.clienteNome) + "</td><td>" + esc(c.categoriaNome) + "</td>" +
      "<td>" + seloPrioridade(c.prioridade) + "</td><td>" + seloStatus(c.status) + "</td>" +
      "<td>" + (c.tecnicoNome ? esc(c.tecnicoNome) : '<span class="text-muted">-</span>') + "</td>" +
      "<td>" + formatarData(c.dataAbertura) + "</td>" +
      '<td class="text-end text-nowrap">' +
      '<a class="btn btn-sm btn-outline-secondary" href="chamado.html?id=' + c.id + '">Detalhe</a> ' +
      '<button class="btn btn-sm btn-outline-primary" data-acao="editar" data-id="' + c.id + '">Editar</button> ' +
      '<button class="btn btn-sm btn-outline-danger" data-acao="excluir" data-id="' + c.id + '">Excluir</button></td></tr>';
  }).join("");
}

// ---------- formulário (novo / editar) ----------
function abrirFormulario(chamado) {
  editandoId = chamado ? chamado.id : null;
  document.getElementById("modal-titulo").textContent = chamado ? "Editar chamado #" + chamado.id : "Novo chamado";
  document.getElementById("erro-modal").innerHTML = "";
  document.getElementById("campo-titulo").value = chamado ? chamado.titulo : "";
  document.getElementById("campo-descricao").value = chamado ? chamado.descricao : "";
  document.getElementById("campo-prioridade").value = chamado ? chamado.prioridade : "";
  document.getElementById("campo-cliente").value = chamado ? chamado.clienteId : "";
  document.getElementById("campo-categoria").value = chamado ? chamado.categoriaId : "";
  document.getElementById("campo-tecnico").value = chamado && chamado.tecnicoId ? chamado.tecnicoId : "";
  modal.show();
}

async function salvar(ev) {
  ev.preventDefault();
  const corpo = {
    titulo: valorDe("campo-titulo"),
    descricao: valorDe("campo-descricao"),
    prioridade: valorDe("campo-prioridade"),
    clienteId: paraNumeroOuNull(valorDe("campo-cliente")),
    categoriaId: paraNumeroOuNull(valorDe("campo-categoria")),
    tecnicoId: paraNumeroOuNull(valorDe("campo-tecnico"))
  };
  try {
    if (editandoId) { await put("/chamados/" + editandoId, corpo); }
    else { await post("/chamados", corpo); }
    modal.hide();
    mostrarSucesso("Chamado salvo com sucesso.");
    await carregarChamados();
  } catch (e) {
    mostrarErro(e, "erro-modal");
  }
}

async function excluir(id) {
  if (!confirm("Excluir o chamado #" + id + "?")) { return; }
  try {
    await del("/chamados/" + id);
    mostrarSucesso("Chamado excluído.");
    await carregarChamados();
  } catch (e) {
    mostrarErro(e);
  }
}

document.getElementById("btn-novo").addEventListener("click", function () { abrirFormulario(null); });
document.getElementById("form-chamado").addEventListener("submit", salvar);
document.getElementById("form-filtros").addEventListener("submit", function (ev) {
  ev.preventDefault();
  carregarChamados();
});
document.getElementById("btn-limpar").addEventListener("click", function () {
  ["filtro-status", "filtro-prioridade", "filtro-cliente", "filtro-categoria", "filtro-tecnico"]
    .forEach(function (id) { document.getElementById(id).value = ""; });
  carregarChamados();
});
document.getElementById("tabela-corpo").addEventListener("click", function (ev) {
  const botao = ev.target.closest("button[data-acao]");
  if (!botao) { return; }
  const id = Number(botao.dataset.id);
  if (botao.dataset.acao === "editar") { abrirFormulario(chamados.find(function (c) { return c.id === id; })); }
  else { excluir(id); }
});

iniciar();