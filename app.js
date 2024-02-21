import express from "express";
import morgan from "morgan";
import authRouter from "./routes/userAuthRoutes.js";
import groupRouter from "./routes/groupRoutes.js";
import leaderRouter from "./routes/leaderRoutes.js";
import groupContentRouter from "./routes/groupContentRouter.js";
import adminRouter from "./routes/adminRoutes.js";
import cors from "cors";

const app = express();

// middleware
app.use(morgan("dev"));
app.use(express.json());
app.use(cors());

// routes
app.use("/api/v1/users", authRouter);
app.use("/api/v1/", groupRouter);
app.use("/api/v1/", leaderRouter);
app.use("/api/v1/", groupContentRouter);
app.use("/api/v1/admin", adminRouter);

export default app;
