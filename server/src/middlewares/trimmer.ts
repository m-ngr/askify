import { Request, Response, NextFunction } from "express";

export function trimmer(req: Request, res: Response, next: NextFunction) {
  if (req.body) trimStrings(req.body);
  next();
}

function trimStrings(obj: any) {
  if (typeof obj !== "object") return;

  for (let key in obj) {
    if (typeof obj[key] === "string") {
      obj[key] = obj[key].trim();
    } else {
      trimStrings(obj[key]);
    }
  }
}
