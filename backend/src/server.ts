import express from "express";
import cors from "cors";
import config from "./config.ts";
import { ensureSeed } from "./users/store.ts";
import { authRouter } from "./auth/routes.ts";
import { chatRouter } from "./chat/routes.ts";
import { documentsRouter } from "./documents/routes.ts";

ensureSeed();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRouter());
app.use("/api/chat", chatRouter());
app.use("/api/documents", documentsRouter());

app.get("/api/health", (_req, res) => res.json({ status: "ok" }));

app.listen(config.port, () => {
  console.log(`Renault Transformation Day — API em http://localhost:${config.port}`);
});
