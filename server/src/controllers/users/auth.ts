import { NextFunction, Request, Response } from "express";
import User from "../../models/User";
import { jwtSign } from "../../utils/jwt";
import { mongooseErrors } from "../../utils/errors";

export async function signup(req: Request, res: Response, next: NextFunction) {
  try {
    const { firstName, lastName, username, email, password } = req.body;
    await User.create({ firstName, lastName, username, email, password });
    return res.status(201).json({ message: "User created successfully" });
  } catch (e) {
    const errors = mongooseErrors(e);
    if (Object.keys(errors).length) {
      return res.status(400).json({ errors });
    }
    next(e);
  }
}

export async function login(req: Request, res: Response, next: NextFunction) {
  try {
    const { login, password, remember } = req.body;
    const user = await User.findOne({
      $or: [{ username: login }, { email: login }],
    })
      .select("+email +password")
      .populate("categories");

    if (!user) {
      return res.status(404).json({ errors: { login: "User not found" } });
    }

    if (!(await user.comparePassword(password))) {
      return res.status(401).json({ errors: { password: "Invalid password" } });
    }

    const maxAge = remember ? 15 * 24 * 60 * 60 * 1000 : undefined; // 15 days

    res.cookie("token", jwtSign({ userId: user.id }), {
      httpOnly: true,
      sameSite: "strict",
      maxAge,
    });

    return res.json({ user });
  } catch (error) {
    next(error);
  }
}

export function logout(req: Request, res: Response) {
  res.clearCookie("token");
  res.sendStatus(204);
}
