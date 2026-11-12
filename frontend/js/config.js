const CONFIG = {
  statusChamado: ["ABERTO", "EM_ANDAMENTO", "PENDENTE", "FECHADO", "CANCELADO"],
  statusFinais: ["FECHADO", "CANCELADO"],

  prioridades: ["BAIXA", "MEDIA", "ALTA", "CRITICA"],
  perfis: ["ADMIN", "TECNICO"],
  
  rotaAtribuirTecnico: "tecnico"
};

function corStatus(status) {
  if (status === "ABERTO") { return "primary"; }
  if (status === "FECHADO") { return "success"; }
  if (status === "CANCELADO") { return "secondary"; }
  if (status === "PENDENTE" || status === "AGUARDANDO_CLIENTE") { return "info"; }
  return "warning";
}

function corPrioridade(prioridade) {
  if (prioridade === "CRITICA") { return "danger"; }
  if (prioridade === "ALTA") { return "warning"; }
  if (prioridade === "MEDIA") { return "info"; }
  return "secondary";
}

function seloStatus(status) {
  return '<span class="badge text-bg-' + corStatus(status) + '">' + esc(status) + '</span>';
}

function seloPrioridade(prioridade) {
  return '<span class="badge text-bg-' + corPrioridade(prioridade) + '">' + esc(prioridade) + '</span>';
}
