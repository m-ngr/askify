import { Router } from "express";
import * as controller from "../controllers/auth";
import { authMiddleware } from "../middlewares/auth";

const router = Router();

router.post("/signup", controller.signup);
router.post("/login", controller.login);
router.post("/logout", authMiddleware, controller.logout);

export default router;
