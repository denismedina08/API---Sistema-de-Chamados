function montarCrud(cfg) {
  const raiz = document.getElementById("conteudo");
  let itens = [];
  let editandoId = null;

  raiz.innerHTML =
    '<div class="d-flex justify-content-between align-items-center mb-3">' +
    '<h1 class="h3 mb-0">' + esc(cfg.titulo) + '</h1>' +
    '<button class="btn btn-primary" id="btn-novo">Novo</button></div>' +
    '<div class="card"><div class="table-responsive"><table class="table table-hover mb-0 align-middle">' +
    '<thead><tr>' + cfg.colunas.map(function (c) { return "<th>" + esc(c.titulo) + "</th>"; }).join("") +
    '<th class="text-end">Ações</th></tr></thead><tbody id="tabela-corpo"></tbody></table></div></div>' +
    '<div class="modal fade" id="modal-form" tabindex="-1"><div class="modal-dialog"><div class="modal-content">' +
    '<form id="form-crud">' +
    '<div class="modal-header"><h5 class="modal-title" id="modal-titulo"></h5>' +
    '<button type="button" class="btn-close" data-bs-dismiss="modal"></button></div>' +
    '<div class="modal-body"><div id="erro-modal"></div>' + cfg.campos.map(htmlCampo).join("") + '</div>' +
    '<div class="modal-footer"><button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">Cancelar</button>' +
    '<button type="submit" class="btn btn-primary">Salvar</button></div>' +
    '</form></div></div></div>';

  const modal = new bootstrap.Modal(document.getElementById("modal-form"));
  const corpoTabela = document.getElementById("tabela-corpo");

  document.getElementById("btn-novo").addEventListener("click", function () { abrirFormulario(null); });
  document.getElementById("form-crud").addEventListener("submit", salvar);
  corpoTabela.addEventListener("click", function (ev) {
    const botao = ev.target.closest("button[data-acao]");
    if (!botao) { return; }
    const id = Number(botao.dataset.id);
    if (botao.dataset.acao === "editar") { abrirFormulario(itens.find(function (i) { return i.id === id; })); }
    else { excluir(id); }
  });

  carregar();

  async function carregar() {
    try {
      itens = listaDe(await get(cfg.rota));
      desenharTabela();
    } catch (e) {
      mostrarErro(e);
    }
  }

  function desenharTabela() {
    if (itens.length === 0) {
      corpoTabela.innerHTML = '<tr><td colspan="' + (cfg.colunas.length + 1) +
        '" class="text-center text-muted py-4">Nenhum registro cadastrado.</td></tr>';
      return;
    }
    corpoTabela.innerHTML = itens.map(function (item) {
      const celulas = cfg.colunas.map(function (c) { return "<td>" + esc(item[c.campo]) + "</td>"; }).join("");
      const extras = cfg.acoesExtras ? cfg.acoesExtras(item) : "";
      return "<tr>" + celulas + '<td class="text-end text-nowrap">' + extras +
        ' <button class="btn btn-sm btn-outline-primary" data-acao="editar" data-id="' + item.id + '">Editar</button>' +
        ' <button class="btn btn-sm btn-outline-danger" data-acao="excluir" data-id="' + item.id + '">Excluir</button></td></tr>';
    }).join("");
  }

  function abrirFormulario(item) {
    editandoId = item ? item.id : null;
    document.getElementById("modal-titulo").textContent = item ? "Editar" : "Novo";
    document.getElementById("erro-modal").innerHTML = "";
    cfg.campos.forEach(function (c) {
      const valor = item && item[c.nome] !== null && item[c.nome] !== undefined ? item[c.nome] : "";
      document.getElementById("campo-" + c.nome).value = valor;
    });
    modal.show();
  }

  async function salvar(ev) {
    ev.preventDefault();
    const corpo = {};
    cfg.campos.forEach(function (c) {
      const valor = document.getElementById("campo-" + c.nome).value.trim();
      corpo[c.nome] = valor === "" ? null : valor;
    });
    try {
      if (editandoId) { await put(cfg.rota + "/" + editandoId, corpo); }
      else { await post(cfg.rota, corpo); }
      modal.hide();
      mostrarSucesso("Registro salvo com sucesso.");
      await carregar();
    } catch (e) {
      mostrarErro(e, "erro-modal"); // o erro aparece dentro da janela, junto do formulário
    }
  }

  async function excluir(id) {
    if (!confirm("Excluir este registro?")) { return; }
    try {
      await del(cfg.rota + "/" + id);
      mostrarSucesso("Registro excluído.");
      await carregar();
    } catch (e) {
      mostrarErro(e);
    }
  }
}

function htmlCampo(c) {
  const id = "campo-" + c.nome;
  const obrigatorio = c.obrigatorio ? " required" : "";
  const maximo = c.maximo ? ' maxlength="' + c.maximo + '"' : "";
  let entrada;
  if (c.tipo === "select") {
    entrada = '<select class="form-select" id="' + id + '"' + obrigatorio + '>' +
      opcoesHtml(c.opcoes.map(function (o) { return { valor: o, texto: o }; }), "", "Selecione...") + '</select>';
  } else if (c.tipo === "textarea") {
    entrada = '<textarea class="form-control" id="' + id + '" rows="3"' + obrigatorio + maximo + '></textarea>';
  } else {
    entrada = '<input type="' + (c.tipo || "text") + '" class="form-control" id="' + id + '"' + obrigatorio + maximo + '>';
  }
  return '<div class="mb-3"><label class="form-label" for="' + id + '">' + esc(c.rotulo) +
    (c.obrigatorio ? " *" : "") + '</label>' + entrada + '</div>';
}