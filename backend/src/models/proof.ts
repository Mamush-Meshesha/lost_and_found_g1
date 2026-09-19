import { Schema, model, Document, Types } from "mongoose";

export interface IProof extends Document {
  itemId: Types.ObjectId;
  holderId: Types.ObjectId; 
  askerId: Types.ObjectId; 
  question: string; 
  answer: string; 
  status: "pending" | "accepted" | "rejected"; // V or X
  createdAt: Date;
  updatedAt: Date;
}

const proofSchema = new Schema<IProof>(
  {
    itemId: {
      type: Schema.Types.ObjectId,
      ref: "Item",
      required: true,
    },
    holderId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    askerId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    question: {
      type: String,
      required: true,
    },
    answer: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected"],
      default: "pending",
    },
  },
  { timestamps: true }
);

export default model<IProof>("Proof", proofSchema);