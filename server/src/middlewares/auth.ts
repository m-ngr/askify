import { Request, RequestHandler } from "express";
import { jwtVerify } from "../utils/jwt";
import User from "../models/User";
import { TokenExpiredError, VerifyErrors } from "jsonwebtoken";
import { JwtAuth } from "../types";

export const authMiddleware: RequestHandler = async (req, res, next) => {
  const token = req.cookies?.token;
  if (!token) {
    return res.status(401).json({ error: "Token not found." });
  }

  let payload: JwtAuth;
  try {
    payload = jwtVerify(token);
  } catch (error) {
    res.clearCookie("token");
    const verifyError = error as VerifyErrors;
    if (verifyError instanceof TokenExpiredError) {
      return res.status(401).json({ error: "Token expired." });
    }
    return res.status(401).json({ error: "Bad token." });
  }

  const user = await User.findById(payload.userId).select("+email +password");
  if (!user) {
    res.clearCookie("token");
    return res.status(401).json({ error: "User not found." });
  }
  req.user = user;
  next();
};

export function isAuth(req: Request) {
  if (req.user) return true;
  return false;
}
