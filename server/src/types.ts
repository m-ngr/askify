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
  categories: ObjectId[];
  followers: number;
  following: number;

  setField(field: string, value: string): Promise<updateResult>;
  comparePassword(password: string): Promise<boolean>;
  hasCategory(catId: string): boolean;
}

export interface Question extends Document {
  fromUser: ObjectId;
  toUser: ObjectId;
  question: string;
  answer: string;
  isAnonymous: boolean;
  category: ObjectId;
  createdAt: Date;
  answeredAt: Date;
  likes: number;
  comments: number;
  //virtual:
  isAnswered: boolean;
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
