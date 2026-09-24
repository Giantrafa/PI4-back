import usuarioService from "../services/usuarioService.js";

const criar = async (req, res) => {
  try {
    const usuario = await usuarioService.criar(req.body);

    return res.status(201).json(usuario);
  } catch (erro) {
    console.error(erro);

    return res.status(500).json({
      mensagem: "Erro ao criar usuário",
    });
  }
};

const listar = async (req, res) => {
  try{
    const usuario = await usuarioService.listar();

    return res.status(200).json(usuario);
  } catch (erro) {
    console.error(erro);

    return res.status(500).json({
      message: "Erro ao listar usuários!",
    });
  }
};

export default {
  criar,
  listar,
};