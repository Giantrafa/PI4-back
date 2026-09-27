import authService from "../services/authService.js";

const login = async (req, res) => {
  const { email, senha } = req.body ?? {};

  if (!email || !senha) {
    return res.status(400).json({
      mensagem: "Email e senha são obrigatórios",
    });
  }

  try {
    const resultado = await authService.login({ email, senha });
    return res.status(200).json(resultado);
  } catch (erro) {
    if (erro.name === "AutenticacaoError") {
      return res.status(401).json({ mensagem: erro.message });
    }

    console.error(erro);

    return res.status(500).json({
      mensagem: "Erro ao realizar login",
    });
  }
};

export default {
  login,
};