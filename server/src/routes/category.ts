import { Router } from "express";
import * as controller from "../controllers/category";
import { authMiddleware } from "../middlewares/auth";

const router = Router();

router.use(authMiddleware);

router.get("/", controller.getCategories);
router.post("/", controller.createCategory);
router.put("/:category", controller.renameCategory);
router.delete("/:category", controller.deleteCategory);

export default router;
