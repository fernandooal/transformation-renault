import express, { type Express } from "express";
import cors from "cors";
import routes from "./routes/index.ts";

export function createApp(): Express {
  const app = express();

  app.use(cors());
  app.use(express.json());
  app.use("/api", routes);

  return app;
}
