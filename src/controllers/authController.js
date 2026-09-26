import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import usuarioService from "../services/usuarioService.js";

const login = async (req, res) => {
  try {
    const { email, senha } = req.body;

    if (!email || !senha) {
      return res.status(400).json({
        mensagem: "Email e senha são obrigatórios",
      });
    }

    const usuario = await usuarioService.buscarPorEmail(email);

    if (!usuario) {
      return res.status(401).json({
        mensagem: "Email ou senha inválidos",
      });
    }

    const senhaValida = await bcrypt.compare(
      senha,
      usuario.senha_hash
    );

    if (!senhaValida) {
      return res.status(401).json({
        mensagem: "Email ou senha inválidos",
      });
    }

    const token = jwt.sign(
      {
        id: usuario.id,
        role: usuario.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );

    return res.status(200).json({
      token,
      usuario: {
        id: usuario.id,
        nome: usuario.nome,
        email: usuario.email,
        role: usuario.role,
      },
    });
  } catch (erro) {
    console.error(erro);

    return res.status(500).json({
      mensagem: "Erro ao realizar login",
    });
  }
};

export default {
  login,
};