montarMenu("clientes");

montarCrud({
  rota: "/clientes",
  titulo: "Clientes",
  colunas: [
    { campo: "id", titulo: "#" },
    { campo: "nome", titulo: "Nome" },
    { campo: "email", titulo: "E-mail" },
    { campo: "telefone", titulo: "Telefone" }
  ],
  campos: [
    { nome: "nome", rotulo: "Nome", obrigatorio: true, maximo: 100 },
    { nome: "email", rotulo: "E-mail", tipo: "email", obrigatorio: true },
    { nome: "telefone", rotulo: "Telefone", maximo: 20 }
  ],
  // atalho: ver os chamados deste cliente
  acoesExtras: function (c) {
    return '<a class="btn btn-sm btn-outline-secondary" href="chamados.html?clienteId=' + c.id + '">Chamados</a>';
  }
});
