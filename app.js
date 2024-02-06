import express from "express";
import morgan from "morgan";
import authRouter from "./routes/userAuthRoutes.js";
import groupRouter from "./routes/groupRoutes.js";
import leaderRouter from './routes/leaderRoutes.js'

const app = express();

// middleware
app.use(morgan("dev"));
app.use(express.json());

// routes
app.use("/api/v1/users", authRouter);
app.use("/api/v1/", groupRouter);
app.use("/api/v1/", leaderRouter);

export default app;
