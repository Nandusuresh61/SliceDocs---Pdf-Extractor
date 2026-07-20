import { Router } from "express";
import { documentController } from "../di/DocumentContainer";
import { uploadMiddleware } from "../middlewares/UploadMiddleware";
import { requireAuth } from "../middlewares/AuthMiddleware";

const router = Router();

router.post(
  "/upload",
  requireAuth,
  uploadMiddleware.single("file"),
  documentController.upload,
);

router.get(
  "/my-files",
  requireAuth,
  documentController.getMyFiles,
);

export default router;
