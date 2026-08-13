import config from "./config/index.ts";
import { createApp } from "./app.ts";
import { ensureSeed } from "./models/user.model.ts";

ensureSeed();

createApp().listen(config.port, () => {
  console.log(`Renault Transformation Day — API em http://localhost:${config.port}`);
});
