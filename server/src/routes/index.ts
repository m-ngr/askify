import { Router } from "express";
import usersRoutes from "./users";
import questionsRoutes from "./questions";
import commentsRoutes from "./comments";

const router = Router();

router.use("/users", usersRoutes);
router.use("/questions", questionsRoutes);
router.use("/comments", commentsRoutes);

export default router;
