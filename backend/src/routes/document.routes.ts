import { Router } from "express";
import * as DocumentController from "../controllers/document.controller.ts";
import { requireAuth, requireRole } from "../middlewares/auth.middleware.ts";

const router = Router();

router.use(requireAuth, requireRole("Demo"));

router.get("/", DocumentController.list);
router.get("/metrics", DocumentController.metrics);
router.post("/", DocumentController.create);
router.get("/:id/file", DocumentController.file);

export default router;
