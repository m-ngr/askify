import { NextFunction, Request, Response } from "express";
import Question from "../models/Question";
import { mongooseErrors } from "../utils/errors";
import User from "../models/User";
import { isValidObjectId } from "mongoose";
import { Question as IQuestion } from "../types";
import Like from "../models/Like";

export async function searchQuestions(
  req: Request,
  res: Response,
  next: NextFunction
) {
  res.send("NOT IMPLEMENTED");
}

export async function createQuestion(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { to, question, isAnonymous, category } = req.body;

    if (!isValidObjectId(to)) {
      return res.status(400).json({
        error: { field: "to", message: "Invalid user ID" },
      });
    }

    const toUser = await User.findById(to);

    if (!toUser) {
      return res.status(404).json({
        error: { field: "to", message: "User not found" },
      });
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

export async function readAnswer(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const id = req.params.id;

  if (!isValidObjectId(id)) {
    return res.status(400).json({ error: "Invalid question ID" });
  }

  const question = await Question.findById(id);

  if (!question) {
    return res.status(404).json({ error: "Question not found" });
  }

  res.locals.question = question;

  if (!question.isAnswered) return next();

  res.json(question.publicInfo());
}

export async function readQuestion(req: Request, res: Response) {
  const question = res.locals.question as IQuestion; // from readAnswer()

  if (req.user?.id != question.toUser) {
    return res.status(401).json({
      error: "You don't have permission to access this question",
    });
  }

  res.json(question.publicInfo());
}

export async function editQuestion(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const id = req.params.id;
    const { answer, category } = req.body;

    if (!isValidObjectId(id)) {
      return res.status(400).json({ error: "Invalid question ID" });
    }

    if (typeof answer !== "string") {
      return res.status(400).json({ error: "Invalid answer type" });
    }

    const question = await Question.findById(id);

    if (!question) {
      return res.status(404).json({ error: "Question not found" });
    }

    if (req.user?.id != question.toUser) {
      return res.status(401).json({
        error: "You don't have permission to access this question",
      });
    }

    if (category) {
      if (!req.user!.categories.includes(category)) {
        return res.status(400).json({
          error: {
            field: "category",
            message: "User does not have such category",
          },
        });
      }
      question.category = category;
    }

    question.answer = answer;
    question.answeredAt = new Date();
    await question.save();
    res.json(question.publicInfo());
  } catch (e) {
    const errors = mongooseErrors(e);
    if (errors.length) {
      return res.status(400).json({ errors });
    }
    next(e);
  }
}

export async function deleteQuestion(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const id = req.params.id;

    if (!isValidObjectId(id)) {
      return res.status(400).json({ error: "Invalid question ID" });
    }

    const question = await Question.findById(id);

    if (!question) {
      return res.status(404).json({ error: "Question not found" });
    }

    if (req.user?.id != question.toUser) {
      return res.status(401).json({
        error: "You don't have permission to access this question",
      });
    }

    await question.deleteOne();
    res.sendStatus(204);
  } catch (error) {
    next(error);
  }
}

export function getComments(req: Request, res: Response, next: NextFunction) {
  res.send("NOT IMPLEMENTED");
}

export function addComment(req: Request, res: Response, next: NextFunction) {
  res.send("NOT IMPLEMENTED");
}

export async function like(req: Request, res: Response, next: NextFunction) {
  try {
    const id = req.params.id;

    if (!isValidObjectId(id)) {
      return res.status(400).json({ error: "Invalid question ID" });
    }

    const question = await Question.findById(id);

    if (!question) {
      return res.status(404).json({ error: "Question not found" });
    }

    if (!question.isAnswered) {
      return res.status(401).json({
        error: "You don't have permission to like this question",
      });
    }

    await Like.create({ user: req.user!.id, question: question.id });
    question.likes += 1;
    await question.save();

    res.status(201).json(question);
  } catch (error: any) {
    if (error.code === 11000) {
      return res.status(409).json({ error: "Answer is already liked" });
    }

    next(error);
  }
}

export async function unlike(req: Request, res: Response, next: NextFunction) {
  try {
    const id = req.params.id;

    if (!isValidObjectId(id)) {
      return res.status(400).json({ error: "Invalid question ID" });
    }

    const question = await Question.findById(id);

    if (!question) {
      return res.status(404).json({ error: "Question not found" });
    }

    if (!question.isAnswered) {
      return res.status(401).json({
        error: "You don't have permission to unlike this question",
      });
    }

    if (!(await Like.findOneAndDelete({ question: id, user: req.user!.id }))) {
      return res.status(404).json({ error: "Answer is already unliked" });
    }

    question.likes -= 1;
    await question.save();

    res.status(200).json(question);
  } catch (error: any) {
    next(error);
  }
}
