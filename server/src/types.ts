import { Document, ObjectId } from "mongoose";

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

  setField(field: string, value: string): Promise<updateResult>;
  comparePassword(password: string): Promise<boolean>;
  publicInfo(): Record<string, any>;
}

export interface Question extends Document {
  fromUser: ObjectId;
  toUser: ObjectId;
  question: string;
  answer: string;
  isAnonymous: boolean;
  category: string;
  createdAt: Date;
  answeredAt: Date;
  likes: number;
  comments: number;
  //virtual:
  isAnswered: boolean;

  publicInfo(): Record<string, any>;
}

declare global {
  namespace Express {
    export interface Request {
      user?: User;
    }
  }
}

export interface validationError {
  field: string;
  message: string;
}

export interface updateResult {
  success: boolean;
  message: string;
}
