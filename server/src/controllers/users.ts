import { NextFunction, Request, Response } from "express";
import User from "../models/User";
import { isValidObjectId } from "mongoose";
import Question from "../models/Question";
import { mongooseErrors } from "../utils/errors";

export async function searchUsers(
  req: Request,
  res: Response,
  next: NextFunction
) {
  // temp
  const users = await User.find();
  return res.json(users);
}

export async function getProfile(req: Request, res: Response) {
  const username = req.params.username;
  const profile = await User.findOne({ username });
  if (!profile) {
    return res.status(404).json({ error: "user not found" });
  }
  res.json(profile.publicInfo());
}

export async function getAnswers(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const id = req.params.id;

  if (!isValidObjectId(id)) {
    return res.status(400).json({ error: "Invalid user ID" });
  }

  const answers = await Question.find({ toUser: id, answer: { $ne: "" } });

  res.json(answers);
}

export async function askUser(req: Request, res: Response, next: NextFunction) {
  try {
    const { question, isAnonymous, category } = req.body;
    const to = req.params.id;

    if (!isValidObjectId(to)) {
      return res.status(400).json({ error: "Invalid user ID" });
    }

    const toUser = await User.findById(to);

    if (!toUser) {
      return res.status(404).json({ error: "User not found" });
    }

    if (isAnonymous && !toUser.allowAnonymous) {
      return res.status(400).json({
        error: {
          field: "isAnonymous",
          message: "User does not allow anonymous questions",
        },
      });
    }

    if (category && !toUser.categories.includes(category)) {
      return res.status(400).json({
        error: {
          field: "category",
          message: "User does not have such category",
        },
      });
    }

    await Question.create({
      fromUser: req.user!.id,
      toUser: toUser.id,
      question,
      isAnonymous,
      category,
    });

    return res.status(201).json({ message: "Question created successfully" });
  } catch (e) {
    const errors = mongooseErrors(e);
    if (errors.length) {
      return res.status(400).json({ errors });
    }
    next(e);
  }
}

export function getFollowers(req: Request, res: Response, next: NextFunction) {
  return res.send("Not Implemented");
}

export function getFollowing(req: Request, res: Response, next: NextFunction) {
  return res.send("Not Implemented");
}

export function follow(req: Request, res: Response, next: NextFunction) {
  return res.send("Not Implemented");
}

export function unfollow(req: Request, res: Response, next: NextFunction) {
  return res.send("Not Implemented");
}
