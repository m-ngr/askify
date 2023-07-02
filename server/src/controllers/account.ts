import { NextFunction, Request, Response } from "express";

export function getInfo(req: Request, res: Response, next: NextFunction) {
  try {
    return res.json(req.user?.publicInfo());
  } catch (error) {
    next(error);
  }
}

export async function deleteAccount(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    await req.user?.deleteOne();
    return res.sendStatus(204);
  } catch (error) {
    next(error);
  }
}

export async function updateInfo(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const user = req.user!;
    const batch = {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      username: req.body.username,
      email: req.body.email,
      avatar: req.body.avatar,
      bio: req.body.bio,
    };
    const allowAnonymous = req.body.allowAnonymous;
    const errors: any[] = [];
    const modified = {};

    for (const field in batch) {
      if (batch[field]) {
        const { success, message } = await user.setField(field, batch[field]);
        if (!success) {
          errors.push({ field, message });
        }
        modified[field] = user.isModified(field);
      }
    }

    if (typeof allowAnonymous === "boolean") {
      user.allowAnonymous = allowAnonymous;
      modified["allowAnonymous"] = user.isModified("allowAnonymous");
    }

    await user.save();

    res.json({ errors, modified, user: user.publicInfo() });
  } catch (error) {
    next(error);
  }
}

export async function updatePassword(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const oldPassword = String(req.body.oldPassword);
    const password = String(req.body.password);

    if (!(await req.user?.comparePassword(oldPassword))) {
      return res.status(401).json({ error: "Incorrect old password" });
    }

    const { success, message } = await req.user!.setField("password", password);

    if (!success) {
      return res.status(400).json({ error: message });
    }

    await req.user?.save();
    res.json({ message: "Password updated successfully" });
  } catch (error) {
    next(error);
  }
}
