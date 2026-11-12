montarMenu("tecnicos");

montarCrud({
  rota: "/tecnicos",
  titulo: "Técnicos",
  colunas: [
    { campo: "id", titulo: "#" },
    { campo: "nome", titulo: "Nome" },
    { campo: "email", titulo: "E-mail" },
    { campo: "perfil", titulo: "Perfil" }
  ],
  campos: [
    { nome: "nome", rotulo: "Nome", obrigatorio: true, maximo: 100 },
    { nome: "email", rotulo: "E-mail", tipo: "email", obrigatorio: true },
    { nome: "perfil", rotulo: "Perfil", tipo: "select", obrigatorio: true, opcoes: CONFIG.perfis }
  ]
});
