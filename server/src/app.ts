import express from "express";
import DocumentRoutes from './presentation/routes/DocumentRoutes'

const app = express();

app.use('/api/documents', DocumentRoutes)


export default app;