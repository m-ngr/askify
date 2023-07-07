import { Schema, model } from "mongoose";

const commentSchema = new Schema({
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
  content: {
    type: String,
    trim: true,
    required: [true, "content is required"],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

commentSchema.set("toJSON", {
  virtuals: false,
  versionKey: false,
  transform: function (doc, ret) {
    ret.id = ret._id;
    delete ret._id;
  },
});

export default model("Comment", commentSchema);
