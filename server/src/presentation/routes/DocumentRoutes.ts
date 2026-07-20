import { Router } from "express";
import { documentController } from "../di/DocumentContainer";
import { uploadMiddleware } from "../middlewares/UploadMiddleware";

const router = Router();

router.post(
  "/upload",
  uploadMiddleware.single("file"),
  documentController.upload,
);

export default router;
