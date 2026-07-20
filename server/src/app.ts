import express from "express";
import DocumentRoutes from './presentation/routes/DocumentRoutes';
import AuthRoutes from './presentation/routes/AuthRoutes';
import cors from "cors";
import cookieParser from "cookie-parser";
const app = express();

app.use(
    cors({
        origin: "http://localhost:5173",
        credentials: true,
    })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use('/api/documents', DocumentRoutes);
app.use('/api/auth', AuthRoutes);


export default app;