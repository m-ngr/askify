import { NextFunction, Request, Response } from "express";
import bcrypt from "bcrypt";
import User from "../models/User";
import { jwtSign } from "../utils/jwt";
import { userValidator } from "../utils/validate";

export async function signup(req: Request, res: Response, next: NextFunction) {
  try {
    const { firstName, lastName, username, email, password } = req.body;
    const errors = userValidator.validate(req.body!, true);

    if (errors.length) return res.status(400).json({ errors });

    if (await User.findOne({ username })) {
      errors.push({ field: "username", message: "Username already exists" });
    }

    if (await User.findOne({ email })) {
      errors.push({ field: "email", message: "Email already exists" });
    }

    if (errors.length) return res.status(409).json({ errors });

    const hash = await bcrypt.hash(password, 10);
    await User.create({ firstName, lastName, username, email, password: hash });

    return res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    next(error);
  }
}

export async function login(req: Request, res: Response, next: NextFunction) {
  try {
    const { login, password } = req.body;
    const user = await User.findOne({
      $or: [{ username: login }, { email: login }],
    });

    if (!user) {
      return res
        .status(404)
        .json({ error: { field: "login", message: "User not found" } });
    }

    if (!(await bcrypt.compare(password, user.password))) {
      return res
        .status(401)
        .json({ error: { field: "password", message: "Invalid password" } });
    }

    res.cookie("token", jwtSign({ userId: user.id }), {
      httpOnly: true,
      sameSite: "strict",
      maxAge: 15 * 24 * 60 * 60 * 1000, // 15 days
    });

    return res.status(200).json({ message: "Login success" });
  } catch (error) {
    next(error);
  }
}

export function logout(req: Request, res: Response) {
  res.clearCookie("token");
  res.sendStatus(204);
}
