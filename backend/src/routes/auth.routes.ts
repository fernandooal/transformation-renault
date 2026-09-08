import { Router } from "express";
import * as AuthController from "../controllers/auth.controller.ts";
import { requireAuth } from "../middlewares/auth.middleware.ts";

const router = Router();

router.post("/login", AuthController.login);
router.get("/me", requireAuth, AuthController.me);

export default router;
