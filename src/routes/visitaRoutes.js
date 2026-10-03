import { Router } from "express";
import visitaController from "../controllers/visitaController.js";
import autenticar from "../middlewares/authMiddleware.js";
import autorizar from "../middlewares/roleMiddleware.js";

const router = Router();

router.post(
  "/",
  autenticar,
  autorizar("admin", "gestor"),
  visitaController.criar
);

export default router;