import { Schema, model } from "mongoose";

const likeSchema = new Schema({
  question: {
    type: Schema.Types.ObjectId,
    ref: "Question",
    required: [true, "question id is required"],
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: [true, "user id is required"],
  },
});

likeSchema.index({ question: 1, user: 1 }, { unique: true });

export default model("Like", likeSchema);
