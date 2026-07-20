import { Schema, model } from "mongoose";

const userSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    avatar: {
      type: String,
    },
    googleId: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const UserModel = model("User", userSchema);
