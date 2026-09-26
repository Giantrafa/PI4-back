import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import models from "../models/index.js";

const { Usuario } = models;

const semSenha = (usuario) => {
  const { senha_hash, ...dados } = usuario.toJSON();

  return dados;
};

const erroValidacao = (mensagem) => {
  const erro = new Error(mensagem);
  erro.name = "ValidacaoError";

  return erro;
};

const criar = async (dados) => {
  const { nome, email, senha, role } = dados;

  if (!senha) {
    throw erroValidacao("A senha é obrigatória");
  }

   const existente = await Usuario.findOne({ where: { email } });
   if (existente) {
      throw erroValidacao("Email já cadastrado");
    }

  const senha_hash = await bcrypt.hash(senha, 10);

  const usuario = await Usuario.create({
    nome,
    email,
    senha_hash,
    role,
  });

  return semSenha(usuario);
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

  const dadosAtualizados = {};

  ["nome", "email", "role"].forEach((campo) => {
    if (dados[campo] !== undefined) {
      dadosAtualizados[campo] = dados[campo];
    }
  });

  if (dados.senha) {
    dadosAtualizados.senha_hash = await bcrypt.hash(dados.senha, 10);
  }

  await usuario.update(dadosAtualizados);

  return semSenha(usuario);
};

const remover = async (id) => {
  const usuario = await Usuario.findByPk(id);

  if (!usuario) {
    return null;
  }

  await usuario.destroy();

  return semSenha(usuario);
};

const erroAutenticacao = () => {
  const erro=new Error ("Email ou senha inválidos");
  erro.name="AutenticacaoError";
  return erro;
}

const login = async ({email, senha}) => {
  if (!email || !senha) throw erroAutenticacao();

  const usuario = await Usuario.findOne({ where: { email }});
  if (!usuario) throw erroAutenticacao();

  const senhaConfere=await bcrypt.compare(senha, usuario.senha_hash);
  if (!senhaConfere) throw erroAutenticacao();

  const token = jwt.sign(
    { id: usuario.id, role: usuario.role }, process.env.JWT_SECRET, {expiresIn: "8h"}
  );

  return {token, usuario: semSenha(usuario)};
}

export default {
  criar,
  listar,
  login,
  buscarPorId,
  atualizar,
  remover,
};