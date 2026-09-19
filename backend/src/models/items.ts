import mongoose from "mongoose";

const itemSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },

    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
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

const Item = mongoose.model("Item", itemSchema);

export default Item;