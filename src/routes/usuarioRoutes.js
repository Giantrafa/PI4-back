import { Router } from "express";
import usuarioController from "../controllers/usuarioController.js";
import autenticar from "../middlewares/authMiddleware.js";
import autorizar from "../middlewares/roleMiddleware.js";

const router = Router();


router.post(
  "/",
  autenticar,
  autorizar("admin"),
  usuarioController.criar
);

router.get(
  "/",
  autenticar,
  autorizar("admin", "gestor"),
  usuarioController.listar
);

router.put(
  "/:id",
  autenticar,
  autorizar("admin"),
  usuarioController.atualizar
);

router.delete(
  "/:id",
  autenticar,
  autorizar("admin"),
  usuarioController.remover
);

router.get(
  "/:id",
  autenticar,
  autorizar("admin"),
  usuarioController.buscarPorId
);

router.post("/login", usuarioController.login);

export default router;