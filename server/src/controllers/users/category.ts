import { NextFunction, Request, Response } from "express";
import Question from "../../models/Question";
import Category from "../../models/Category";
import { isValidObjectId } from "mongoose";

export async function getCategories(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const user = req.user!;
    await user.populate("categories");
    res.json({ categories: user.categories });
  } catch (error) {
    next(error);
  }
}

export async function createCategory(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const user = req.user!;
    const category: string = req.body.category;

    if (!category) {
      return res.status(400).json({ error: "category is required" });
    }

    if (typeof category !== "string") {
      return res.status(400).json({ error: "Invalid category type" });
    }

    const cat = await Category.create({ user: user.id, name: category });
    user.updateOne({ $push: { categories: cat.id } }).exec();

    res.status(201).json(cat);
  } catch (error) {
    next(error);
  }
}

export async function getCategory(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const id = req.params.id.trim();
    const user = req.user!;

    if (!isValidObjectId(id)) {
      return res.status(400).json({ error: "Invalid category id" });
    }

    if (!user.hasCategory(id)) {
      return res.status(404).json({ error: "Category not found" });
    }

    const category = await Category.findOne({ _id: id, user: user.id });

    if (!category) {
      user.updateOne({ $pull: { categories: id } }).exec();
      return res.status(404).json({ error: "Category not found" });
    }

    return res.json(category);
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
    const user = req.user!;
    const id = req.params.id.trim();
    const name: string = req.body.category;

    if (!isValidObjectId(id)) {
      return res.status(400).json({ error: "Invalid category id" });
    }

    if (!user.hasCategory(id)) {
      return res.status(404).json({ error: "Category not found" });
    }

    if (!name) {
      return res.status(400).json({ error: "category is required" });
    }

    if (typeof name !== "string") {
      return res.status(400).json({ error: "Invalid category type" });
    }

    const category = await Category.findOneAndUpdate(
      { _id: id, user: user.id },
      { name },
      { runValidators: true, new: true }
    );

    if (!category) {
      user.updateOne({ $pull: { categories: id } }).exec();
      return res.status(404).json({ error: "Category not found" });
    }

    res.status(200).json(category);
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
    const user = req.user!;
    const id = req.params.id.trim();

    if (!isValidObjectId(id)) {
      return res.status(400).json({ error: "Invalid category id" });
    }

    const category = await Category.findOneAndDelete({
      _id: id,
      user: user.id,
    });

    if (!category) {
      return res.status(404).json({ error: "Category not found" });
    }

    user.updateOne({ $pull: { categories: id } }).exec();

    Question.updateMany(
      { toUser: user.id, category: id },
      { $unset: { category: 1 } }
    ).exec();

    res.status(200).json(category);
  } catch (error) {
    next(error);
  }
}
