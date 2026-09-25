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
      message: "Erro ao listar usuários",
    });
  }
};

const atualizar = async (req, res) => {
  try {
    const usuario = await usuarioService.atualizar(
      req.params.id,
      req.body
    );

    if (!usuario) {
      return res.status(404).json({
        mensagem: "Usuário não encontrado",
      });
    }

    return res.status(200).json(usuario);
  } catch (erro) {
    console.error(erro);

    return res.status(500).json({
      mensagem: "Erro ao atualizar usuário",
    });
  }
};

const remover = async (req, res) => {
  try{
    const usuario = await usuarioService.remover(req.params.id);

    if (!usuario) {
      return res.status(404).json({
        mensagem: "Usuário não encontrado",
      });
    }

    return res.status(200).json(usuario);
  } catch (erro) {
    console.error(erro);

    return res.status(500).json({
      mensagem: "Erro ao apagar usuário",
    });
  }
};

const buscarPorId = async (req, res) => {
  try{
    const usuario = await usuarioService.buscarPorId(req.params.id)

    if (!usuario) {
      return res.status(404).json({
        mensagem: "Usuário não encontrado",
      });
    }
    return res.status(200).json(usuario);
  } catch (erro) {
    console.error(erro);

    return res.status(500).json({
      mensagem: "Erro ao buscar usuário",
    });
  }
};

export default {
  criar,
  listar,
  atualizar,
  remover,
  buscarPorId,
};