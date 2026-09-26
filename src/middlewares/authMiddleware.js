import jwt from "jsonwebtoken";

const autenticar = (req, res, next) => {
  try {
    const authorization = req.headers.authorization;

    if (!authorization) {
      return res.status(401).json({
        mensagem: "Token não informado",
      });
    }

    const [tipo, token] = authorization.split(" ");

    if (tipo !== "Bearer" || !token) {
      return res.status(401).json({
        mensagem: "Token inválido",
      });
    }

    const payload = jwt.verify(token, process.env.JWT_SECRET);

    req.usuario = payload;

    next();
  } catch (erro) {
    console.error(erro);

    return res.status(401).json({
      mensagem: "Token inválido ou expirado",
    });
  }
};

export default autenticar;