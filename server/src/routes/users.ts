import { Router } from "express";
import * as controller from "../controllers/users";
import { authMiddleware } from "../middlewares/auth";

const router = Router();

router.get("/", controller.searchUsers);
router.get("/profiles/:username", controller.getProfile);
router.get("/:id/inbox", controller.getAnswers);

router.use(authMiddleware);

router.get("/:id/inbox", controller.getInbox);
router.post("/:id/inbox", controller.askUser);

router.get("/:id/following", controller.getFollowing);
router.get("/:id/followers", controller.getFollowers);
router.post("/:id/followers", controller.follow);
router.delete("/:id/followers", controller.unfollow);

export default router;
