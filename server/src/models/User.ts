import { Schema, model } from "mongoose";
import { User } from "../types";

const userSchema = new Schema<User>({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  avatar: { type: String },
  bio: { type: String },
  allowAnonymous: { type: Boolean, default: true },
  followers: { type: Number, default: 0, min: 0 },
  following: { type: Number, default: 0, min: 0 },
  categories: {
    type: [String],
    default: ["general"],
    validate: {
      validator: function (value: string[]) {
        const hasGeneral = value.includes("general");
        const uniqueValues = new Set(value);
        return hasGeneral && uniqueValues.size === value.length;
      },
      message:
        'The categories field must have "general" as one of the values and unique values.',
    },
  },
});

export default model("User", userSchema);
