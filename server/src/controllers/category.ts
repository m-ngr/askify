import { NextFunction, Request, Response } from "express";

export function getCategories(req: Request, res: Response) {
  res.json({ categories: req.user?.categories });
}

export async function createCategory(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const category: string = req.body.category;

    if (typeof category !== "string") {
      return res.status(400).json({ error: "Invalid category type" });
    }

    if (category.length === 0) {
      return res.status(400).json({ error: "Category cannot be empty" });
    }

    if (req.user?.categories.includes(category)) {
      return res.status(409).json({
        error: `${category} category already exists`,
      });
    }

    req.user?.categories.push(category);
    await req.user?.save();
    res.status(201).json({
      message: `${category} category created successfully`,
      categories: req.user?.categories,
    });
  } catch (error) {
    next(error);
  }
}

export async function renameCategory(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const category = req.params.category.trim();
    const newCategory: string = req.body.category;

    if (typeof newCategory !== "string") {
      return res.status(400).json({ error: "Invalid category type" });
    }

    if (newCategory.length === 0) {
      return res.status(400).json({ error: "Category cannot be empty" });
    }

    if (req.user?.categories.includes(newCategory)) {
      return res.status(409).json({
        error: `${newCategory} category already exists`,
      });
    }

    if (category === "general") {
      return res.status(400).json({
        error: "Cannot rename the 'general' category",
      });
    }

    const idx = req.user!.categories.findIndex((cat) => cat === category);
    if (idx === -1) {
      return res.status(404).json({ error: `${category} category not found` });
    }

    req.user!.categories[idx] = newCategory;
    await req.user?.save();

    res.status(200).json({
      message: `${category} renamed to ${newCategory} successfully`,
      categories: req.user!.categories,
    });
  } catch (error) {
    next(error);
  }
}

export async function deleteCategory(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const category = req.params.category.trim();

    if (category === "general") {
      return res.status(400).json({
        error: "Cannot delete the 'general' category",
      });
    }

    const idx = req.user!.categories.findIndex((cat) => cat === category);

    if (idx === -1) {
      return res.status(404).json({ error: `${category} category not found` });
    }

    req.user!.categories.splice(idx, 1);
    await req.user!.save();

    res.status(204).json({
      message: `${category} category deleted successfully`,
      categories: req.user!.categories,
    });
  } catch (error) {
    next(error);
  }
}
