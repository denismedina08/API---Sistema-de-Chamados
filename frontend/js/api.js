class ErroApi extends Error {
  constructor(status, dados) {
    super((dados && dados.erro) || ("Erro " + status));
    this.status = status;
    this.dados = dados;
  }
}

async function api(metodo, caminho, corpo) {
  const opcoes = { method: metodo, headers: {} };
  if (corpo !== undefined) {
    opcoes.headers["Content-Type"] = "application/json";
    opcoes.body = JSON.stringify(corpo);
  }

  let resposta;
  try {
    resposta = await fetch(caminho, opcoes);
  } catch (e) {
    throw new ErroApi(0, { erro: "Não foi possível conectar ao servidor. A aplicação está rodando?" });
  }

  if (resposta.status === 204) { return null; }

  const texto = await resposta.text();
  let dados = null;
  try { dados = texto ? JSON.parse(texto) : null; } catch (e) { dados = null; }

  if (!resposta.ok) { throw new ErroApi(resposta.status, dados); }
  return dados;
}

const get = (caminho) => api("GET", caminho);
const post = (caminho, corpo) => api("POST", caminho, corpo);
const put = (caminho, corpo) => api("PUT", caminho, corpo);
const patch = (caminho, corpo) => api("PATCH", caminho, corpo);
const del = (caminho) => api("DELETE", caminho);

function listaDe(dados) {
  if (Array.isArray(dados)) { return dados; }
  return (dados && dados.content) || [];
}

function esc(valor) {
  if (valor === null || valor === undefined) { return ""; }
  return String(valor)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function formatarData(iso) {
  if (!iso) { return "-"; }
  const data = new Date(iso);
  return isNaN(data) ? "-" : data.toLocaleString("pt-BR");
}

function paraNumeroOuNull(valor) {
  return (valor === "" || valor === null || valor === undefined) ? null : Number(valor);
}

function opcoesHtml(itens, selecionado, textoPadrao) {
  let html = (textoPadrao !== undefined) ? '<option value="">' + esc(textoPadrao) + '</option>' : "";
  html += itens.map(function (i) {
    const marcado = String(i.valor) === String(selecionado) ? " selected" : "";
    return '<option value="' + esc(i.valor) + '"' + marcado + '>' + esc(i.texto) + '</option>';
  }).join("");
  return html;
}

function definirHtml(id, html) {
  document.getElementById(id).innerHTML = html;
}

function valorDe(id) {
  return document.getElementById(id).value.trim();
}

function mensagemErro(e) {
  if (!(e instanceof ErroApi)) { return esc(e && e.message ? e.message : e); }

  let mensagem = esc(e.message);
  if (e.status === 500) {
    mensagem = "Erro interno do servidor (500). Se você estava excluindo, o registro pode estar em uso por outro cadastro.";
  }
  const detalhes = e.dados && e.dados.detalhes;
  if (detalhes && detalhes.length) {
    mensagem += '<ul class="mb-0">' + detalhes.map(function (d) { return "<li>" + esc(d) + "</li>"; }).join("") + "</ul>";
  }
  return mensagem;
}

function mostrarAlerta(tipo, html, idDestino) {
  const destino = document.getElementById(idDestino || "alertas");
  if (!destino) { return; }
  destino.innerHTML =
    '<div class="alert alert-' + tipo + ' alert-dismissible fade show" role="alert">' + html +
    '<button type="button" class="btn-close" data-bs-dismiss="alert"></button></div>';
}

function mostrarErro(e, idDestino) { mostrarAlerta("danger", mensagemErro(e), idDestino); }
function mostrarSucesso(texto) { mostrarAlerta("success", esc(texto)); }