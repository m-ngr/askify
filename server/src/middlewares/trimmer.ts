import { Request, Response, NextFunction } from "express";

export function trimmer(req: Request, res: Response, next: NextFunction) {
  if (req.body) {
    for (let key in req.body) {
      if (typeof req.body[key] === "string") {
        req.body[key] = req.body[key].trim();
      }
    }
  }

  next();
}
