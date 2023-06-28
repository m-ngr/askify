import { Document } from "mongoose";

export interface JwtAuth {
  userId: string;
}

export interface User extends Document {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  password: string;
  avatar: string;
  bio: string;
  allowAnonymous: boolean;
  categories: string[];
  followers: number;
  following: number;
}

declare global {
  namespace Express {
    export interface Request {
      user?: User;
    }
  }
}

export interface validatorError {
  field: string;
  message: string;
}
