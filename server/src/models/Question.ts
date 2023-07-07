import { Schema, model } from "mongoose";
import { Question } from "../types";

const questionSchema = new Schema<Question>({
  fromUser: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: [true, "fromUser id is required"],
  },
  toUser: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: [true, "toUser id is required"],
  },
  question: {
    type: String,
    trim: true,
    required: [true, "Question is required"],
  },
  answer: {
    type: String,
    trim: true,
    default: "",
  },
  isAnonymous: {
    type: Boolean,
    default: false,
  },
  category: {
    type: String,
    trim: true,
    required: [true, "category is required"],
    default: "general",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  answeredAt: {
    type: Date,
  },
  likes: {
    type: Number,
    default: 0,
    min: 0,
  },
  comments: {
    type: Number,
    default: 0,
    min: 0,
  },
});

questionSchema.virtual("isAnswered").get(function () {
  return this.answer !== "";
});

questionSchema.index({ question: "text", answer: "text" });

questionSchema.set("toJSON", {
  virtuals: false,
  versionKey: false,
  transform: function (doc, ret) {
    ret.id = ret._id;

    if (ret.isAnonymous) ret.fromUser = null;

    delete ret._id;
    delete ret.isAnonymous;
  },
});

export default model("Question", questionSchema);
