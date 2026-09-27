import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import models from "../models/index.js";

const { Usuario } = models;

const erroAutenticacao = () => {
  const erro = new Error("Email ou senha inválidos");
  erro.name = "AutenticacaoError";

  return erro;
};

const login = async (dados = {}) => {
  const { email, senha } = dados ?? {};

  if (!email || !senha) {
    throw erroAutenticacao();
  }

  const usuario = await Usuario.findOne({ where: { email } });

  if (!usuario || !(await bcrypt.compare(senha, usuario.senha_hash))) {
    throw erroAutenticacao();
  }

  const token = jwt.sign(
    { id: usuario.id, role: usuario.role },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );

  return {
    token,
    usuario: {
      id: usuario.id,
      nome: usuario.nome,
      email: usuario.email,
      role: usuario.role,
    },
  };
};

export default {
  login,
};