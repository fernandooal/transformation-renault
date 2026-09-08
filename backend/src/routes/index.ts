import { Router } from "express";
import authRoutes from "./auth.routes.ts";
import chatRoutes from "./chat.routes.ts";
import documentRoutes from "./document.routes.ts";

const router = Router();

router.get("/health", (_req, res) => res.json({ status: "ok" }));
router.use("/auth", authRoutes);
router.use("/chat", chatRoutes);
router.use("/documents", documentRoutes);

export default router;
