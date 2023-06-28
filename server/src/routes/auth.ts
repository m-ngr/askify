import { Router } from "express";
import * as controller from "../controllers/auth";

const router = Router();

router.post("/signup", controller.signup);
router.post("/login", controller.login);
router.post("/logout", controller.logout);

export default router;
