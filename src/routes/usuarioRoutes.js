import { Router } from "express";
import usuarioController from "../controllers/usuarioController.js";

const router = Router();

router.post("/", usuarioController.criar);
router.get("/", usuarioController.listar);

export default router;