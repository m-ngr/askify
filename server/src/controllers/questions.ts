import { NextFunction, Request, Response } from "express";
import Question from "../models/Question";
import { mongooseErrors, isValidRegex } from "../utils/errors";
import { isValidObjectId } from "mongoose";
import { Question as IQuestion } from "../types";
import Like from "../models/Like";
import Comment from "../models/Comment";

export async function searchQuestions(
  req: Request,
  res: Response,
  next: NextFunction
) {
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

    const questions = await Question.find(filter)
      .sort({ createdAt: sort === "oldest" ? 1 : -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    res.json({ page, questions });
  } catch (error) {
    next(error);
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

  res.json(question);
}

export async function readQuestion(req: Request, res: Response) {
  const question = res.locals.question as IQuestion; // from readAnswer()

  if (req.user?.id != question.toUser) {
    return res.status(403).json({
      error: "You don't have permission to access this question",
    });
  }

  res.json(question);
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

    const question = await Question.findOneAndDelete({
      _id: id,
      toUser: req.user!.id,
    });

    if (!question) {
      if (await Question.exists({ _id: id })) {
        return res.status(403).json({
          error: "You don't have permission to delete this question",
        });
      }
      return res.status(404).json({ error: "Question not found" });
    }

    if (question.likes) Like.deleteMany({ question: id }).exec();
    if (question.comments) Comment.deleteMany({ question: id }).exec();

    res.sendStatus(204);
  } catch (error) {
    next(error);
  }
}

export async function changeCategory(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { id } = req.params;
    const { category } = req.body;
    const user = req.user!;

    if (!isValidObjectId(id)) {
      return res.status(400).json({ error: "Invalid question ID" });
    }

    if (!category) {
      return res.status(400).json({ error: "category is required" });
    }

    if (typeof category !== "string") {
      return res.status(400).json({ error: "Invalid category type" });
    }

    if (!user.hasCategory(category)) {
      return res.status(400).json({
        error: `User does not have a ${category} category`,
      });
    }

    const question = await Question.findOneAndUpdate(
      { _id: id, toUser: user.id },
      { category },
      { new: true, runValidators: true }
    );

    if (!question) {
      if (await Question.exists({ _id: id })) {
        return res.status(403).json({
          error: "You don't have permission to edit this question",
        });
      }
      return res.status(404).json({ error: "Question not found" });
    }

    res.json(question);
  } catch (e) {
    const errors = mongooseErrors(e);
    if (errors.length) {
      return res.status(400).json({ errors });
    }
    next(e);
  }
}

export async function changeAnswer(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { id } = req.params;
    const { answer } = req.body;

    if (!isValidObjectId(id)) {
      return res.status(400).json({ error: "Invalid question ID" });
    }

    if (!answer) {
      return res.status(400).json({ error: "answer is required" });
    }

    if (typeof answer !== "string") {
      return res.status(400).json({ error: "Invalid answer type" });
    }

    const question = await Question.findOneAndUpdate(
      { _id: id, toUser: req.user?.id },
      { answer, answeredAt: new Date() },
      { new: true, runValidators: true }
    );

    if (!question) {
      if (await Question.exists({ _id: id })) {
        return res.status(403).json({
          error: "You don't have permission to edit this answer",
        });
      }
      return res.status(404).json({ error: "Question not found" });
    }

    res.json(question);
  } catch (e) {
    const errors = mongooseErrors(e);
    if (errors.length) {
      return res.status(400).json({ errors });
    }
    next(e);
  }
}

export async function deleteAnswer(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({ error: "Invalid answer ID" });
    }

    const answer = await Question.findOneAndUpdate(
      { _id: id, toUser: req.user?.id, answer: { $ne: "" } },
      { answer: "", likes: 0, comments: 0 },
      { new: false, runValidators: true }
    );

    if (!answer) {
      if (await Question.exists({ _id: id, answer: { $ne: "" } })) {
        return res.status(403).json({
          error: "You don't have permission to delete this answer",
        });
      }
      return res.status(404).json({ error: "Answer not found" });
    }

    if (answer.likes) Like.deleteMany({ question: answer.id }).exec();
    if (answer.comments) Comment.deleteMany({ question: answer.id }).exec();

    res.sendStatus(204);
  } catch (error) {
    next(error);
  }
}

export async function like(req: Request, res: Response, next: NextFunction) {
  try {
    const id = req.params.id;

    if (!isValidObjectId(id)) {
      return res.status(400).json({ error: "Invalid answer ID" });
    }

    const answer = await Question.findOne({ _id: id, answer: { $ne: "" } });

    if (!answer) {
      return res.status(404).json({ error: "Answer not found" });
    }

    await Like.create({ user: req.user!.id, question: answer.id });
    answer.likes += 1;
    answer.save();

    res.sendStatus(201);
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
      return res.status(400).json({ error: "Invalid answer ID" });
    }

    if (!(await Like.findOneAndDelete({ question: id, user: req.user!.id }))) {
      if (await Question.exists({ _id: id, answer: { $ne: "" } })) {
        return res.status(409).json({ error: "Answer is already unliked" });
      }
      return res.status(404).json({ error: "Answer not found" });
    }

    Question.findOneAndUpdate(
      { _id: id, answer: { $ne: "" } },
      { $inc: { likes: -1 } }
    ).exec();

    res.sendStatus(204);
  } catch (error) {
    next(error);
  }
}

export async function addComment(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const id = req.params.id;
    const content = req.body.content;

    if (!isValidObjectId(id)) {
      return res.status(400).json({ error: "Invalid answer ID" });
    }

    const answer = await Question.findOne({ _id: id, answer: { $ne: "" } });

    if (!answer) {
      return res.status(404).json({ error: "Answer not found" });
    }

    const comment = await Comment.create({
      user: req.user!.id,
      question: answer.id,
      content,
    });

    answer.comments += 1;
    answer.save();

    res.status(201).json(comment);
  } catch (e: any) {
    const errors = mongooseErrors(e);
    if (errors.length) {
      return res.status(400).json({ errors });
    }
    next(e);
  }
}

export async function getComments(req: Request, res: Response) {
  /**
   * Should we paginate comments?
   * Should we sort comments on the server?
   */
  const id = req.params.id;

  if (!isValidObjectId(id)) {
    return res.status(400).json({ error: "Invalid answer ID" });
  }

  const comments = await Comment.find({ question: id });
  res.json(comments);
}
