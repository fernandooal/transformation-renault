import { Router } from "express";
import * as ChatController from "../controllers/chat.controller.ts";
import { requireAuth, requireRole } from "../middlewares/auth.middleware.ts";

const router = Router();

router.post("/", requireAuth, requireRole("Demo"), ChatController.send);

export default router;
