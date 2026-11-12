montarMenu("painel");

async function carregar() {
  try {
    // size=500 é ignorado pelo back-end atual; ajuda se a listagem passar a ser paginada
    const chamados = listaDe(await get("/chamados?size=500"));
    desenharResumo(chamados);
  } catch (e) {
    mostrarErro(e);
  }
}

/** Conta quantos chamados existem para cada valor de um campo (ex.: status). */
function contar(lista, campo) {
  const total = {};
  lista.forEach(function (c) { total[c[campo]] = (total[c[campo]] || 0) + 1; });
  return total;
}

function cartao(titulo, quantidade, link) {
  return '<div class="col-6 col-md-3 col-lg-2"><a class="cartao-contagem" href="' + link + '">' +
    '<div class="card h-100"><div class="card-body py-3">' +
    '<div class="text-muted small">' + esc(titulo) + '</div>' +
    '<div class="numero">' + quantidade + '</div></div></div></a></div>';
}

function desenharResumo(chamados) {
  const porStatus = contar(chamados, "status");
  const porPrioridade = contar(chamados, "prioridade");

  // inclui também status que existam nos dados mas não estejam em CONFIG
  const listaStatus = CONFIG.statusChamado.concat(
    Object.keys(porStatus).filter(function (s) { return CONFIG.statusChamado.indexOf(s) < 0; }));

  let html = '<h2 class="h6 text-uppercase text-muted">Geral</h2><div class="row g-3 mb-3">' +
    cartao("Total de chamados", chamados.length, "chamados.html") + '</div>';

  html += '<h2 class="h6 text-uppercase text-muted">Por status</h2><div class="row g-3 mb-3">' +
    listaStatus.map(function (s) {
      return cartao(s, porStatus[s] || 0, "chamados.html?status=" + encodeURIComponent(s));
    }).join("") + '</div>';

  html += '<h2 class="h6 text-uppercase text-muted">Por prioridade</h2><div class="row g-3">' +
    CONFIG.prioridades.map(function (p) {
      return cartao(p, porPrioridade[p] || 0, "chamados.html?prioridade=" + encodeURIComponent(p));
    }).join("") + '</div>';

  definirHtml("resumo", html);
}

carregar();
