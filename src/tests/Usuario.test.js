import { beforeEach, describe, expect, it, vi } from "vitest";
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

const criarUsuarioFalso = (dados) => {
  const usuario = { id: 1, ...dados };
  return { toJSON: () => ({ ...usuario }) };
};

beforeEach(() => {
  vi.clearAllMocks();
});

describe("cadastro de usuário", () => {
  it("cadastra com senha protegida e não devolve o hash", async () => {
    const dados = {
      nome: "Bia",
      email: "bia@exemplo.com",
      senha: "1234",
      role: "fiscalizador",
    };
    Usuario.findOne.mockResolvedValue(null);
    Usuario.create.mockImplementation(async (dadosCriacao) =>
      criarUsuarioFalso(dadosCriacao)
    );

    const resultado = await usuarioService.criar(dados);
    const dadosSalvos = Usuario.create.mock.calls[0][0];

    expect(Usuario.findOne).toHaveBeenCalledWith({
      where: { email: dados.email },
    });
    expect(dadosSalvos.senha_hash).not.toBe(dados.senha);
    expect(await bcrypt.compare(dados.senha, dadosSalvos.senha_hash)).toBe(true);
    expect(resultado).toEqual({
      id: 1,
      nome: dados.nome,
      email: dados.email,
      role: dados.role,
    });
    expect(resultado.senha_hash).toBeUndefined();
  });

  it("rejeita cadastro sem senha", async () => {
    await expect(
      usuarioService.criar({
        nome: "Bia",
        email: "bia@exemplo.com",
        role: "fiscalizador",
      })
    ).rejects.toThrow("A senha é obrigatória");

    expect(Usuario.findOne).not.toHaveBeenCalled();
    expect(Usuario.create).not.toHaveBeenCalled();
  });

  it("rejeita cadastro com email já existente", async () => {
    Usuario.findOne.mockResolvedValue(criarUsuarioFalso({ id: 2 }));

    await expect(
      usuarioService.criar({
        nome: "Bia",
        email: "bia@exemplo.com",
        senha: "1234",
        role: "fiscalizador",
      })
    ).rejects.toThrow("Email já cadastrado");

    expect(Usuario.create).not.toHaveBeenCalled();
  });
});

describe("validações do modelo Usuario", () => {
  it.todo("deve exigir nome");
  it.todo("deve rejeitar nome vazio");
  it.todo("deve exigir email");
  it.todo("deve rejeitar email em formato inválido");
  it.todo("deve exigir senha_hash");
  it.todo("deve aceitar apenas os papéis permitidos");
});

describe("listar usuários", () => {
  it.todo("deve retornar usuários sem senha_hash");
});

describe("buscar usuário por id", () => {
  it.todo("deve retornar o usuário encontrado");
  it.todo("deve retornar null quando o usuário não existir");
});

describe("atualizar usuário", () => {
  it.todo("deve atualizar os dados informados");
  it.todo("deve salvar a nova senha como hash");
  it.todo("deve retornar null quando o usuário não existir");
});

describe("remover usuário", () => {
  it.todo("deve remover o usuário encontrado");
  it.todo("deve retornar null quando o usuário não existir");
});
