import { NextFunction, Request, Response } from "express";
import User from "../models/User";

export async function searchUsers(
  req: Request,
  res: Response,
  next: NextFunction
) {
  // temp
  const users = await User.find();
  return res.json(users);
}

export function getProfile(req: Request, res: Response, next: NextFunction) {
  return res.send("Not Implemented");
}

export function getInbox(req: Request, res: Response, next: NextFunction) {
  return res.send("Not Implemented");
}

export function askUser(req: Request, res: Response, next: NextFunction) {
  return res.send("Not Implemented");
}

export function getAnswers(req: Request, res: Response, next: NextFunction) {
  return res.send("Not Implemented");
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
