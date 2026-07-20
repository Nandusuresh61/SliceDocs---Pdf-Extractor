import { Schema, model } from "mongoose";

const documentSchema = new Schema(
  {
    ownerId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: false, // until authentication is implemented
    },

    originalName: {
      type: String,
      required: true,
      trim: true,
    },

    storageId: {
      type: String,
      required: true,
    },

    url: {
      type: String,
      required: true,
    },

    pageCount: {
      type: Number,
      required: true,
    },

    size: {
      type: Number,
      required: true,
    },

    type: {
      type: String,
      enum: ["ORIGINAL", "GENERATED"],
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const DocumentModel = model("Document", documentSchema);