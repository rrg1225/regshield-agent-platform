import { createApp } from "./http.js";

const port = Number(process.env.PORT ?? 4740);
const app = createApp();

app.listen(port, () => {
  console.log(`RegShield Agent Platform API listening on http://127.0.0.1:${port}`);
});
