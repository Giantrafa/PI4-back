import { Router } from "express";

import authController from "../controllers/authController.js";

const router = Router();
//rota alterada para entrega de testes
router.post("/loginnnn", authController.login);

export default router;