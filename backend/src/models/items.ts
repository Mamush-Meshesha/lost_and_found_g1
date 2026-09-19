import mongoose from "mongoose";
import { Schema, model, Document, Types } from "mongoose";

export interface IItem extends Document {
  userId: Types.ObjectId;
  categoryId: Types.ObjectId;
  title: string;
  description: string;
  lostDate: Date;
  location: {
    address: string;
  };
  images: string[];
  privateDetails: string | null;
  question: string; 
  status: "active" | "recovered" | "closed";
  createdAt: Date;
  updatedAt: Date;
}

const itemSchema = new Schema<IItem>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },
    categoryId: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    lostDate: {
      type: Date,
      required: true,
    },
    location: {
      address: {
        type: String,
        required: true,
      },
    },
    images: [
      {
        type: String,
      },
    ],
    privateDetails: {
      type: String,
      default: null,
    },
    question: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: String,
      enum: ["active", "recovered", "closed"],
      default: "active",
    },
  },
  {
    timestamps: true,
  }
);

const Item = mongoose.model<IItem>("Item", itemSchema);

export default Item;