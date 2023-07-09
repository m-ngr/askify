import { Router } from "express";
import * as controller from "../controllers/users";
import { authMiddleware } from "../middlewares/auth";

const router = Router();

router.get("/", controller.searchUsers);
router.get("/:handle", controller.getProfile);
router.get("/:handle/questions", controller.getAnswers);

router.use(authMiddleware);

router.get("/me/categories", controller.getCategories);
router.post("/me/categories", controller.createCategory);
router.get("/me/categories/:id", controller.getCategory);
router.put("/me/categories/:id", controller.renameCategory);
router.delete("/me/categories/:id", controller.deleteCategory);

router.post("/:handle/questions", controller.askUser);

export default router;
