import { Request, Response, NextFunction } from "express";
import { mongooseErrors } from "../utils/errors";
import Comment from "../models/Comment";
import { isValidObjectId } from "mongoose";
import Question from "../models/Question";

export async function editComment(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const id = req.params.id;
    const content = req.body.content;

    if (!isValidObjectId(id)) {
      return res.status(400).json({ error: "Invalid comment ID" });
    }

    const comment = await Comment.findById(id);

    if (!comment) {
      return res.status(404).json({ error: "Comment not found" });
    }

    if (req.user!.id != comment.user) {
      return res.status(403).json({
        error: "You don't have permission to edit this comment",
      });
    }

    comment.content = content;
    await comment.save();

    res.json(comment);
  } catch (e: any) {
    const errors = mongooseErrors(e);
    if (errors.length) {
      return res.status(400).json({ errors });
    }
    next(e);
  }
}

export async function deleteComment(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const id = req.params.id;
    const user = req.user!;

    if (!isValidObjectId(id)) {
      return res.status(400).json({ error: "Invalid comment ID" });
    }

    const comment = await Comment.findById(id);

    if (!comment) {
      return res.status(404).json({ error: "Comment not found" });
    }

    const question = await Question.findById(comment.question);

    if (user.id != comment.user && user.id != question?.toUser) {
      return res.status(403).json({
        error: "You don't have permission to delete this comment",
      });
    }

    await comment.deleteOne();

    if (question) {
      question.comments -= 1;
      await question.save();
    }

    res.sendStatus(204);
  } catch (error) {
    next(error);
  }
}
