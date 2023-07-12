import { NextFunction, Request, Response } from "express";
import User from "../../models/User";
import { isValidObjectId } from "mongoose";
import Question from "../../models/Question";
import { isValidRegex, mongooseErrors } from "../../utils/errors";

export async function searchUsers(
  req: Request,
  res: Response,
  next: NextFunction
) {
  /**
   * Need Testing
   */
  try {
    const query = req.query.q as string;
    const page = Math.max(1, parseInt(req.query.page as string) || 1);
    const limit = Math.max(
      1,
      Math.min(parseInt(req.query.limit as string) || 10, 100)
    );

    const filter: any = {};
    const sortOption: any = {};

    if (query) {
      if ("regex" in req.query) {
        if (!isValidRegex(query)) {
          return res.status(400).json({ error: "Invalid regex query" });
        }
        filter.$or = [
          { firstName: { $regex: query, $options: "i" } },
          { lastName: { $regex: query, $options: "i" } },
          { username: { $regex: query, $options: "i" } },
          { bio: { $regex: query, $options: "i" } },
        ];
      } else {
        filter.$text = { $search: query };
        sortOption.score = { $meta: "textScore" };
      }
    }

    const users = await User.find(filter, sortOption)
      .sort({ ...sortOption, _id: 1 })
      .skip((page - 1) * limit)
      .limit(limit);

    res.json({ page, users });
  } catch (error) {
    next(error);
  }
}

export async function getProfile(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const handle = req.params.handle;

    const user = await (isValidObjectId(handle)
      ? User.findById(handle).populate("categories")
      : User.findOne({ username: handle })
    ).populate("categories");

    if (!user) {
      return res.status(404).json({ error: "user not found" });
    }

    res.json(user);
  } catch (error) {
    next(error);
  }
}

export async function getAnswers(
  req: Request,
  res: Response,
  next: NextFunction
) {
  /**
   * Need Testing
   */
  try {
    const query = req.query.q as string;
    const sort = String(req.query.sort).toLowerCase();
    const page = Math.max(1, parseInt(req.query.page as string) || 1);
    const limit = Math.max(
      1,
      Math.min(parseInt(req.query.limit as string) || 10, 100)
    );

    const filter: any = { answer: { $ne: "" } };

    if (query) {
      if ("regex" in req.query) {
        if (!isValidRegex(query)) {
          return res.status(400).json({ error: "Invalid regex query" });
        }
        filter.$or = [
          { question: { $regex: query, $options: "i" } },
          { answer: { $regex: query, $options: "i" } },
        ];
      } else {
        filter.$text = { $search: query };
      }
    }

    if ("cat" in req.query) {
      const cat = (req.query.cat as string).trim().toLowerCase();

      if (cat === "" || cat === "general") {
        filter.category = undefined;
      } else if (isValidObjectId(cat)) {
        filter.category = cat;
      } else {
        return res.status(400).json({ error: "Invalid category id" });
      }
    }

    const handle = req.params.handle;
    const toUser = isValidObjectId(handle)
      ? handle
      : (await User.findOne({ username: handle }, { id: 1 }))?.id;

    if (!toUser) {
      return res.status(400).json({ error: "Invalid user handle" });
    }

    filter.toUser = toUser;

    const questions = await Question.find(filter)
      .sort({ answeredAt: sort === "oldest" ? 1 : -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    res.json({ page, questions });
  } catch (error) {
    next(error);
  }
}

// ============================================================================================

export async function askUser(req: Request, res: Response, next: NextFunction) {
  try {
    const { question, isAnonymous, category } = req.body;
    const handle = req.params.handle.trim();

    if (!question) {
      return res.status(400).json({ error: "Question is required" });
    }

    if (category && !isValidObjectId(category)) {
      return res.status(400).json({ error: "Invalid category id" });
    }

    const toUser = await (isValidObjectId(handle)
      ? User.findById(handle)
      : User.findOne({ username: handle }));

    if (!toUser) {
      return res.status(404).json({ error: "User not found" });
    }

    if (isAnonymous && !toUser.allowAnonymous) {
      return res.status(400).json({
        error: "User does not allow anonymous questions",
      });
    }

    if (category && !toUser.hasCategory(category)) {
      return res.status(400).json({
        error: "User does not have such category",
      });
    }

    await Question.create({
      fromUser: req.user!.id,
      toUser: toUser.id,
      question,
      isAnonymous,
      category: category ? category : undefined,
    });

    return res.status(201).json({ message: "Question created successfully" });
  } catch (e) {
    const errors = mongooseErrors(e);
    if (Object.keys(errors).length) {
      return res.status(400).json({ errors });
    }
    next(e);
  }
}
