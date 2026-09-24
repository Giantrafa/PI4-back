import bcrypt from "bcrypt";
import models from "../models/index.js";

const { Usuario } = models;

const criar = async (dados) => {
  const { nome, email, senha, role } = dados;

  const senha_hash = await bcrypt.hash(senha, 10);

  const usuario = await Usuario.create({
    nome,
    email,
    senha_hash,
    role,
  });

  return usuario;
};

const listar = async () => {
  return await Usuario.findAll({
    attributes: {
      exclude: ["senha_hash"],
    },
  });
};

const buscarPorId = async (id) => {
  const usuario = await Usuario.findByPk(id, {
    attributes: {
      exclude: ["senha_hash"],
    },
  });

  return usuario;
};

const atualizar = async (id, dados) => {
  const usuario = await Usuario.findByPk(id);

  if (!usuario) {
    return null;
  }

  const dadosAtualizados = {
    nome: dados.nome,
    email: dados.email,
    role: dados.role,
  };

  if (dados.senha) {
    dadosAtualizados.senha_hash = await bcrypt.hash(dados.senha, 10);
  }

  await usuario.update(dadosAtualizados);

  return usuario;
};

const remover = async (id) => {
  const usuario = await Usuario.findByPk(id);

  if (!usuario) {
    return null;
  }

  await usuario.destroy();

  return usuario;
};

export default {
  criar,
  listar,
  buscarPorId,
  atualizar,
  remover,
};