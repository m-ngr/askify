import { Router } from "express";
import { authMiddleware } from "../middlewares/auth";
import * as controller from "../controllers/questions";

const router = Router();

router.get("/", controller.searchQuestions);
router.get("/:id", controller.readAnswer);
router.get("/:id/comments", controller.getComments);

router.use(authMiddleware);

router.post("/", controller.createQuestion);
router.get("/:id", controller.readQuestion);
router.put("/:id", controller.editQuestion);
router.delete("/:id", controller.deleteQuestion);
router.post("/:id/likes", controller.like);
router.delete("/:id/likes", controller.unlike);
router.post("/:id/comments", controller.addComment);

export default router;
