import visitaService from "../services/visitaService.js";

const tratarErro = (res, erro, mensagem) => {
  if (
    erro.name === "SequelizeValidationError" ||
    erro.name === "ValidacaoError"
  ) {
    return res.status(400).json({
      mensagem,
      erros: erro.errors
        ? erro.errors.map((e) => e.message)
        : [erro.message],
    });
  }

  if (erro.name === "SequelizeForeignKeyConstraintError") {
    return res.status(400).json({
      mensagem: "Gestor ou fiscalizador informado não existe no sistema.",
    });
  }

  console.error(erro);

  return res.status(500).json({
    mensagem,
  });
};

const criar = async (req, res) => {
  try {
    const { fiscalizadores_ids, fiscalizadores, ...dadosVisita } = req.body;
    const ids = fiscalizadores_ids || fiscalizadores || [];

    if (!dadosVisita.gestor_id && req.usuario?.id) {
      dadosVisita.gestor_id = req.usuario.id;
    }

    const visita = await visitaService.criar(dadosVisita, ids);

    return res.status(201).json(visita);
  } catch (erro) {
    return tratarErro(res, erro, "Erro ao criar visita");
  }
};

const listar = async (req, res) => {
  try {
    const filtros = {
      status: req.query.status,
      gestor_id: req.query.gestor_id,
      fiscalizador_id: req.query.fiscalizador_id,
    };

    if (req.usuario?.role === "fiscalizador") {
      filtros.fiscalizador_id = req.usuario.id;
    }

    const visitas = await visitaService.listar(filtros);

    return res.status(200).json(visitas);
  } catch (erro) {
    return tratarErro(res, erro, "Erro ao listar visitas");
  }
};

export default {
  criar,
  listar,
};