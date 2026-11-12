function montarMenu(ativa) {
  const itens = [
    ["painel", "index.html", "Painel"],
    ["chamados", "chamados.html", "Chamados"],
    ["clientes", "clientes.html", "Clientes"],
    ["categorias", "categorias.html", "Categorias"],
    ["tecnicos", "tecnicos.html", "Técnicos"]
  ];

  const links = itens.map(function (i) {
    const classe = i[0] === ativa ? "nav-link active" : "nav-link";
    return '<li class="nav-item"><a class="' + classe + '" href="' + i[1] + '">' + i[2] + '</a></li>';
  }).join("");

  document.getElementById("menu").innerHTML =
    '<nav class="navbar navbar-expand-md navbar-dark bg-dark mb-4">' +
    '<div class="container">' +
    '<a class="navbar-brand" href="index.html">Chamados</a>' +
    '<button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#menu-itens">' +
    '<span class="navbar-toggler-icon"></span></button>' +
    '<div class="collapse navbar-collapse" id="menu-itens"><ul class="navbar-nav">' + links + '</ul></div>' +
    '</div></nav>';
}
