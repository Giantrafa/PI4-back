import { beforeEach, describe, expect, it, vi } from "vitest";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import models from "../models/index.js";
import authService from "../services/authService.js";
import autenticar from "../middlewares/authMiddleware.js";
import autorizar from "../middlewares/roleMiddleware.js";

vi.mock("../models/index.js", () => ({
  default: {
    Usuario: {
      findOne: vi.fn(),
    },
  },
}));

const { Usuario } = models;
const SEGREDO = "segredo-de-teste";

const criarRes = () => {
  const res = {};
  res.status = vi.fn(() => res);
  res.json = vi.fn(() => res);
  return res;
};

beforeEach(() => {
  vi.clearAllMocks();
  process.env.JWT_SECRET = SEGREDO;
  vi.spyOn(console, "error").mockImplementation(() => {});
});

describe("login (authService)", () => {
  it("retorna token válido e dados do usuário sem a senha", async () => {
    const senha_hash = await bcrypt.hash("1234", 10);
    Usuario.findOne.mockResolvedValue({
      id: 1,
      nome: "Bia",
      email: "bia@exemplo.com",
      role: "gestor",
      senha_hash,
    });

    const resultado = await authService.login({
      email: "bia@exemplo.com",
      senha: "1234",
    });
    const payload = jwt.verify(resultado.token, SEGREDO);

    expect(Usuario.findOne).toHaveBeenCalledWith({
      where: { email: "bia@exemplo.com" },
    });
    expect(payload).toMatchObject({ id: 1, role: "gestor" });
    expect(resultado.usuario).toEqual({
      id: 1,
      nome: "Bia",
      email: "bia@exemplo.com",
      role: "gestor",
    });
  });

  it("rejeita quando email ou senha não são informados", async () => {
    await expect(authService.login({ email: "bia@exemplo.com" })).rejects.toThrow(
      "Email ou senha inválidos"
    );
    await expect(authService.login()).rejects.toThrow("Email ou senha inválidos");
    expect(Usuario.findOne).not.toHaveBeenCalled();
  });

  it("rejeita quando o usuário não existe", async () => {
    Usuario.findOne.mockResolvedValue(null);

    await expect(
      authService.login({ email: "x@exemplo.com", senha: "1234" })
    ).rejects.toMatchObject({ name: "AutenticacaoError" });
  });

  it("rejeita quando a senha está errada", async () => {
    Usuario.findOne.mockResolvedValue({
      id: 1,
      senha_hash: await bcrypt.hash("certa", 10),
    });

    await expect(
      authService.login({ email: "bia@exemplo.com", senha: "errada" })
    ).rejects.toThrow("Email ou senha inválidos");
  });
});

describe("middleware autenticar", () => {
  it("aceita token válido e coloca o usuário na requisição", () => {
    const token = jwt.sign({ id: 1, role: "admin" }, SEGREDO);
    const req = { headers: { authorization: `Bearer ${token}` } };
    const res = criarRes();
    const next = vi.fn();

    autenticar(req, res, next);

    expect(next).toHaveBeenCalledTimes(1);
    expect(req.usuario).toMatchObject({ id: 1, role: "admin" });
  });

  it("retorna 401 sem o cabeçalho Authorization", () => {
    const res = criarRes();
    const next = vi.fn();

    autenticar({ headers: {} }, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ mensagem: "Token não informado" });
    expect(next).not.toHaveBeenCalled();
  });

  it("retorna 401 quando o formato não é Bearer", () => {
    const res = criarRes();
    const next = vi.fn();

    autenticar({ headers: { authorization: "Basic abc" } }, res, next);

    expect(res.json).toHaveBeenCalledWith({ mensagem: "Token inválido" });
    expect(next).not.toHaveBeenCalled();
  });

  it("retorna 401 para token assinado com outro segredo", () => {
    const token = jwt.sign({ id: 1 }, "outro-segredo");
    const res = criarRes();
    const next = vi.fn();

    autenticar({ headers: { authorization: `Bearer ${token}` } }, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ mensagem: "Token inválido ou expirado" });
    expect(next).not.toHaveBeenCalled();
  });

  it("retorna 401 para token expirado", () => {
    const token = jwt.sign({ id: 1 }, SEGREDO, { expiresIn: -10 });
    const res = criarRes();
    const next = vi.fn();

    autenticar({ headers: { authorization: `Bearer ${token}` } }, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(next).not.toHaveBeenCalled();
  });
});

describe("middleware autorizar", () => {
  it("deixa passar quando o perfil é permitido", () => {
    const res = criarRes();
    const next = vi.fn();

    autorizar("admin", "gestor")({ usuario: { role: "gestor" } }, res, next);

    expect(next).toHaveBeenCalledTimes(1);
  });

  it("retorna 403 quando o perfil não é permitido", () => {
    const res = criarRes();
    const next = vi.fn();

    autorizar("admin")({ usuario: { role: "fiscalizador" } }, res, next);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(next).not.toHaveBeenCalled();
  });

  it("retorna 401 quando não há usuário autenticado", () => {
    const res = criarRes();
    const next = vi.fn();

    autorizar("admin")({}, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(next).not.toHaveBeenCalled();
  });
});
