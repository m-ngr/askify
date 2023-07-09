import { Schema, model } from "mongoose";
import { User, updateResult } from "../types";
import uniqueValidator from "mongoose-unique-validator";
import bcrypt from "bcrypt";

const userSchema = new Schema<User>({
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
    select: false,
  },
  password: {
    type: String,
    required: [true, "Password is required"],
    minlength: [8, "Password must have a minimum of 8 characters"],
    maxlength: [512, "Password must have a maximum of 512 characters"],
    match: [
      /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).+$/,
      "Password must contain one uppercase letter, one lowercase letter, one number, and one special character",
    ],
    select: false,
  },
  avatar: { type: String, trim: true },
  bio: { type: String, trim: true },
  allowAnonymous: { type: Boolean, default: true },
  followers: { type: Number, default: 0, min: 0 },
  following: { type: Number, default: 0, min: 0 },
  categories: [
    {
      type: Schema.Types.ObjectId,
      ref: "Category",
    },
  ],
});

userSchema.index(
  { firstName: "text", lastName: "text", username: "text", bio: "text" },
  { weights: { firstName: 5, lastName: 4, username: 2, bio: 1 } }
);

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
  const user = this as User;
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

userSchema.methods.comparePassword = async function (password: string) {
  return await bcrypt.compare(password.toString(), this.password);
};

userSchema.methods.hasCategory = function (catId: string): boolean {
  const user = this as User;
  let idx = -1;
  if (user.populated("categories")) {
    idx = user.categories.findIndex(
      (cat: any) => cat.id.toString() === catId.toLowerCase()
    );
  } else {
    idx = user.categories.findIndex(
      (cat: any) => cat.toString() === catId.toLowerCase()
    );
  }
  return idx !== -1;
};

userSchema.set("toJSON", {
  virtuals: false,
  versionKey: false,
  transform: function (doc, ret) {
    ret.id = ret._id;
    delete ret._id;
    delete ret.password;
  },
});

export default model("User", userSchema);
