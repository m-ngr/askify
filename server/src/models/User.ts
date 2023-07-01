import { Schema, model } from "mongoose";
import { UserDoc, updateResult } from "../types";
import uniqueValidator from "mongoose-unique-validator";
import bcrypt from "bcrypt";

const userSchema = new Schema<UserDoc>({
  firstName: {
    type: String,
    trim: true,
    required: [true, "First Name is required"],
    maxlength: [50, "First Name must have a maximum of 50 characters"],
  },
  lastName: {
    type: String,
    trim: true,
    required: [true, "Last Name is required"],
    maxlength: [50, "Last Name must have a maximum of 50 characters"],
  },
  username: {
    type: String,
    trim: true,
    unique: true,
    lowercase: true,
    required: [true, "Username is required"],
    minlength: [3, "Username must have a minimum of 3 characters"],
    maxlength: [20, "Username must have a maximum of 20 characters"],
    match: [
      /^[a-zA-Z0-9._-]+$/,
      "Username can only contain alphanumeric characters, dots, dashes, and underscores",
    ],
  },
  email: {
    type: String,
    trim: true,
    unique: true,
    lowercase: true,
    required: [true, "Email is required"],
    match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Invalid email address"],
  },
  password: {
    type: String,
    required: [true, "Password is required"],
    minlength: [8, "Password must have a minimum of 8 characters"],
    maxlength: [50, "Password must have a maximum of 50 characters"],
    match: [
      /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).+$/,
      "Password must contain one uppercase letter, one lowercase letter, one number, and one special character",
    ],
  },
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

userSchema.plugin(uniqueValidator, { message: "{VALUE} already exists" });

userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    try {
      const hashedPassword = await bcrypt.hash(this.password, 10);
      this.password = hashedPassword;
    } catch (error: any) {
      return next(error);
    }
  }
  next();
});

userSchema.methods.setField = async function (
  field: string,
  value: string
): Promise<updateResult> {
  const user = this as UserDoc;
  if (!(field in user)) throw Error("No such field");

  const original = user[field];
  if (value === original) return { success: true, message: "No change" };

  try {
    user[field] = value;
    await user.validate(field);
    return { success: true, message: "Updated" };
  } catch (e: any) {
    user[field] = original;
    user.unmarkModified(field);
    if (e.name === "ValidationError") {
      const errorField = Object.keys(e.errors)[0];
      const message = e.errors[errorField].message;
      return { success: false, message };
    }
    throw e;
  }
};

userSchema.methods.batch = async function () {
  const user = this as UserDoc;
  // update each field separatly
};

userSchema.methods.comparePassword = async function (password: string) {
  return await bcrypt.compare(password.toString(), this.password);
};

export default model("User", userSchema);
