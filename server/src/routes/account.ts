import { Router } from "express";
import * as controller from "../controllers/account";
import { authMiddleware } from "../middlewares/auth";

const router = Router();
router.use(authMiddleware);

router.get("/", controller.getInfo);
router.patch("/", controller.updateInfo);
router.delete("/", controller.deleteAccount);
router.put("/password", controller.updatePassword);

export default router;
