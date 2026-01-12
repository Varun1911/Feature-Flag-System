import express from "express";
import "./config/env"; // load env
import { connectMongo } from "./config/mongo";
import { getRedis } from "./config/redis";
import routes from "./api/routes/index.js";

const app = express();

app.use(express.json());

app.use("/api", routes);

export async function initApp() {
  await connectMongo();
  getRedis();
  return app;
}
