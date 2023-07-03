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
    required: [true, "Question is required"],
  },
  answer: {
    type: String,
    default: "",
  },
  isAnonymous: {
    type: Boolean,
    default: false,
  },
  category: {
    type: String,
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

questionSchema.methods.publicInfo = function () {
  const { fromUser, __v, _id, ...info } = this._doc;
  if (this.isAnonymous) {
    return { id: _id, ...info };
  } else {
    return { id: _id, ...info, fromUser };
  }
};

export default model("Question", questionSchema);
