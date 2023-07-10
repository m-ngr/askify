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
    const { login, password } = req.body;
    const user = await User.findOne({
      $or: [{ username: login }, { email: login }],
    }).select("+email +password");

    if (!user) {
      return res
        .status(404)
        .json({ error: { field: "login", message: "User not found" } });
    }

    if (!(await user.comparePassword(password))) {
      return res
        .status(401)
        .json({ error: { field: "password", message: "Invalid password" } });
    }

    res.cookie("token", jwtSign({ userId: user.id }), {
      httpOnly: true,
      sameSite: "strict",
      maxAge: 15 * 24 * 60 * 60 * 1000, // 15 days
    });

    return res.status(200).json({ user });
  } catch (error) {
    next(error);
  }
}

export function logout(req: Request, res: Response) {
  res.clearCookie("token");
  res.sendStatus(204);
}
