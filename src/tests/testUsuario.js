import "dotenv/config";

import usuarioService from "./services/usuarioService.js";

const testar = async () => {
  try {
    const usuario = await usuarioService.criar({
      nome: "Lucas Teste",
      email: "lucas.teste@email.com",
      senha: "123456",
      role: "gestor",
    });

    console.log("Usuário criado:");
    console.log(usuario.toJSON());

    const usuarios = await usuarioService.listar();

    console.log("Usuários:");
    console.log(usuarios.map((usuario) => usuario.toJSON()));
  } catch (erro) {
    console.error("Erro:", erro);
  }
};

testar();