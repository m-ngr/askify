import { NextFunction, Request, Response } from "express";
import { isValidRegex } from "../../utils/errors";
import { isValidObjectId } from "mongoose";
import Question from "../../models/Question";
import Category from "../../models/Category";
import Like from "../../models/Like";
import Comment from "../../models/Comment";
import config from "../../config";

export function getInfo(req: Request, res: Response, next: NextFunction) {
  try {
    const { categories, ...user } = req.user!.toJSON();
    return res.json(user);
  } catch (error) {
    next(error);
  }
}

export async function deleteAccount(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const user = req.user!;

    // delete user categories
    Category.deleteMany({ _id: { $in: user.categories } }).exec();

    // delete my questions
    const likesOnQuestion: any[] = [];
    const commentsOnQuestion: any[] = [];
    const questionsToDelete = await Question.find(
      { toUser: user.id },
      { likes: 1, comments: 1 }
    );

    for (let i = 0; i < questionsToDelete.length; ++i) {
      const doc = questionsToDelete[i];
      if (doc.likes > 0) likesOnQuestion.push(doc.id);
      if (doc.comments > 0) commentsOnQuestion.push(doc.id);
    }

    Question.deleteMany({ toUser: user.id }).exec();
    Like.deleteMany({ question: { $in: likesOnQuestion } }).exec();
    Comment.deleteMany({ question: { $in: commentsOnQuestion } }).exec();

    // Mark user as deleted
    Question.updateMany(
      { fromUser: user.id },
      { $unset: { fromUser: 1 } }
    ).exec();
    Like.updateMany({ user: user.id }, { $unset: { user: 1 } }).exec();
    Comment.updateMany({ user: user.id }, { $unset: { user: 1 } }).exec();

    user.deleteOne();

    res.clearCookie("token", config.cookieOptions());
    return res.sendStatus(204);
  } catch (error) {
    next(error);
  }
}

export async function updateInfo(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const user = req.user!;
    const batch = {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      username: req.body.username,
      email: req.body.email,
      avatar: req.body.avatar,
      bio: req.body.bio,
    };
    const allowAnonymous = req.body.allowAnonymous;
    const errors: Record<string, string> = {};
    const modified = {};

    for (const field in batch) {
      if (typeof batch[field] === "string") {
        const { success, message } = await user.setField(field, batch[field]);
        if (!success) errors[field] = message;

        if (user.isModified(field)) {
          modified[field] = batch[field];
        }
      }
    }

    if (typeof allowAnonymous === "boolean") {
      user.allowAnonymous = allowAnonymous;
      if (user.isModified("allowAnonymous")) {
        modified["allowAnonymous"] = allowAnonymous;
      }
    }

    await user.save();

    res.json({ errors, modified });
  } catch (error) {
    next(error);
  }
}

export async function updatePassword(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const oldPassword = String(req.body.oldPassword);
    const password = String(req.body.password);
    const user = req.user!;

    if (!(await user.comparePassword(oldPassword))) {
      return res.status(401).json({ error: "Incorrect old password" });
    }

    const { success, message } = await user.setField("password", password);

    if (!success) {
      return res.status(400).json({ error: message });
    }

    await user.save();
    res.json({ message: "Password updated successfully" });
  } catch (error) {
    next(error);
  }
}

export async function checkPassword(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const password = String(req.body.password);
    const user = req.user!;

    if (!(await user.comparePassword(password))) {
      return res.status(401).json({ error: "Incorrect password" });
    }

    res.json({ message: "Correct password" });
  } catch (error) {
    next(error);
  }
}

export async function getInbox(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const user = req.user!;
    const query = req.query.q as string;
    const sort = String(req.query.sort).toLowerCase();
    const page = Math.max(1, parseInt(req.query.page as string) || 1);
    const limit = Math.max(
      1,
      Math.min(parseInt(req.query.limit as string) || 10, 100)
    );

    const filter: any = { toUser: user.id, answer: "" };

    if (query) {
      if ("regex" in req.query) {
        if (!isValidRegex(query)) {
          return res.status(400).json({ error: "Invalid regex query" });
        }
        filter.$or = [{ question: { $regex: query, $options: "i" } }];
      } else {
        filter.$text = { $search: query };
      }
    }

    if ("cat" in req.query) {
      const cat = (req.query.cat as string).trim().toLowerCase();

      if (cat === "all") {
      } else if (cat === "") {
        filter.category = undefined;
      } else if (isValidObjectId(cat)) {
        filter.category = cat;
      } else {
        return res.status(400).json({ error: "Invalid category id" });
      }
    }

    const questions = await Question.find(filter)
      .sort({ createdAt: sort === "oldest" ? 1 : -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .select("fromUser question isAnonymous category createdAt")
      .populate("fromUser", "firstName lastName username avatar");

    res.json({ page, questions });
  } catch (error) {
    next(error);
  }
}
