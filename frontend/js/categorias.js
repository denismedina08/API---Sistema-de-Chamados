montarMenu("categorias");

montarCrud({
  rota: "/categorias",
  titulo: "Categorias",
  colunas: [
    { campo: "id", titulo: "#" },
    { campo: "nome", titulo: "Nome" },
    { campo: "descricao", titulo: "Descrição" }
  ],
  campos: [
    { nome: "nome", rotulo: "Nome", obrigatorio: true, maximo: 100 },
    { nome: "descricao", rotulo: "Descrição", tipo: "textarea", obrigatorio: true, maximo: 255 }
  ]
});
