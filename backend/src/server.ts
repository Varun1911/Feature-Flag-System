import { initApp } from "./app";

const PORT = process.env.PORT || 8000;

async function start() {
  const app = await initApp();
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

start();
