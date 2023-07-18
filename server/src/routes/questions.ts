import { Router } from "express";
import { authMiddleware } from "../middlewares/auth";
import * as controller from "../controllers/questions";

const router = Router();

router.get("/", controller.searchQuestions);
router.get("/:id", controller.readAnswer);
router.get("/:id/comments", controller.getComments);
router.get("/:id/likes", controller.isLiked);

router.use(authMiddleware);

router.get("/:id", controller.readQuestion);
router.delete("/:id", controller.deleteQuestion);
router.put("/:id/category", controller.changeCategory);
router.put("/:id/answer", controller.changeAnswer);
router.delete("/:id/answer", controller.deleteAnswer);
router.post("/:id/likes", controller.like);
router.delete("/:id/likes", controller.unlike);
router.post("/:id/comments", controller.addComment);

export default router;
