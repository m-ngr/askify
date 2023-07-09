import { Schema, model } from "mongoose";

const categorySchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: [true, "user id is required"],
    select: false,
  },
  name: {
    type: String,
    trim: true,
    required: [true, "name is required"],
  },
});

categorySchema.set("toJSON", {
  virtuals: false,
  versionKey: false,
  transform: function (doc, ret) {
    ret.id = ret._id;
    delete ret._id;
  },
});

export default model("Category", categorySchema);
