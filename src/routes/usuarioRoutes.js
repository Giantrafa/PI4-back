import { Router } from "express";
import usuarioController from "../controllers/usuarioController.js";

const router = Router();

router.post("/", usuarioController.criar);
router.get("/", usuarioController.listar);
router.put("/:id", usuarioController.atualizar);
router.delete("/:id", usuarioController.remover);
router.get("/:id", usuarioController.buscarPorId);

export default router;