import express from "express";
import cors from "cors";
import config from "./config.js";
import { ensureSeed } from "./users/store.js";
import { authRouter } from "./auth/routes.js";
import { chatRouter } from "./chat/routes.js";
import { documentsRouter } from "./documents/routes.js";

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
