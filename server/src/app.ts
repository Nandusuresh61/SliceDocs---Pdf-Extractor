import express from "express";
import DocumentRoutes from './presentation/routes/DocumentRoutes';
import AuthRoutes from './presentation/routes/AuthRoutes';
import cors from "cors";
import cookieParser from "cookie-parser";
import { env } from "./config/env";
import { errorMiddleware } from "./presentation/middlewares/ErrorMiddleware";
const app = express();

app.use(
    cors({
        origin: env.CLIENT_URL,
        credentials: true,
    })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use('/api/documents', DocumentRoutes);
app.use('/api/auth', AuthRoutes);

app.use(errorMiddleware);

export default app;