import { Router } from "express";
import authRoutes from "./auth";
import categoryRoutes from "./category";
import usersRoutes from "./users";
import accountRoutes from "./account";
import questionsRoutes from "./questions";
import commentsRoutes from "./comments";

const router = Router();

router.use(authRoutes);
router.use("/category", categoryRoutes);
router.use("/users", usersRoutes);
router.use("/account", accountRoutes);
router.use("/questions", questionsRoutes);
router.use("/comments", commentsRoutes);

export default router;
