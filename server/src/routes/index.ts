import { Router } from "express";
import authRoutes from "./auth";
import categoryRoutes from "./category";

const router = Router();

router.use(authRoutes);
router.use("/category", categoryRoutes);

export default router;
