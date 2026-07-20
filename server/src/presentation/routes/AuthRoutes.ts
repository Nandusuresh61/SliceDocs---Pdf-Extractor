import { Router } from "express";
import { authController } from "../di/AuthContainer";

const router = Router();

router.post("/google", authController.googleLogin);
router.post("/logout", authController.logout);
router.post("/refresh", authController.refresh);

export default router;
