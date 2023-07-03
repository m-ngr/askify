import { Router } from "express";
import { authMiddleware } from "../middlewares/auth";
import * as controller from "../controllers/comments";

const router = Router();

router.use(authMiddleware);

router.patch("/:id", controller.editComment);
router.delete("/:id", controller.deleteComment);

export default router;
