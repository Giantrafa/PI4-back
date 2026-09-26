import { describe, it, expect, vi, beforeEach } from "vitest";
import bcrypt from "bcrypt";
import models from "../models/index.js";
import usuarioService from "../services/usuarioService.js";
 
vi.mock("../models/index.js", () => ({
  default: {
    Usuario: {
      create: vi.fn(),
      findOne: vi.fn(),
    },
  },
}));

const { Usuario } = models;
 
const usuario = (dados = {}) => {
  const base = {
    id: 1,
    nome: "Ana",
    email: "ana@x.com",
    role: "FISCAL",
    senha_hash: "hash_qualquer",
    ...dados,
  };
 
  return { ...base, toJSON: () => ({ ...base }) };
};
 
describe("criar", () => {
  it("usuário não deve criar uma conta sem senha", async () => {
    const dadosSemSenha = { nome: "Ana", email: "ana@x.com", role: "FISCAL" };
 
    await expect(usuarioService.criar(dadosSemSenha)).rejects.toThrow(
      "A senha é obrigatória"
    );
     expect(Usuario.create).not.toHaveBeenCalled();
  });
 
  it("usuário não deve criar uma conta com email já cadastrado", async () => {
    Usuario.findOne.mockResolvedValue(usuario({ id: 2 }));
 
    const dados = {
      nome: "Ana",
      email: "ana@x.com",
      senha: "senha1234",
      role: "FISCAL",
    };
 
    await expect(usuarioService.criar(dados)).rejects.toThrow(
      "Email já cadastrado"
    );
 
    expect(Usuario.create).not.toHaveBeenCalled();
  });
});
 
describe("login", () => {
  it("usuário não deve conseguir logar com senha errada", async () => {
    const senha_hash = await bcrypt.hash("senhaCorreta", 10);
    Usuario.findOne.mockResolvedValue(usuario({ senha_hash }));
 
    await expect(
      usuarioService.login({ email: "ana@x.com", senha: "senhaErrada" })
    ).rejects.toThrow("Email ou senha inválidos");
  });
 
  it("usuário não deve conseguir logar com e-mail inexistente", async () => {
    Usuario.findOne.mockResolvedValue(null);
 
    await expect(
      usuarioService.login({ email: "ninguem@x.com", senha: "senha1234" })
    ).rejects.toThrow("Email ou senha inválidos");
  });
 
  it("usuário não deve conseguir logar sem e-mail ou senha", async () => {
    await expect(
      usuarioService.login({ email: "ana@x.com" })
    ).rejects.toThrow("Email ou senha inválidos");
 
    await expect(
      usuarioService.login({ senha: "senha1234" })
    ).rejects.toThrow("Email ou senha inválidos");
 
    expect(Usuario.findOne).not.toHaveBeenCalled();
  });
});
 