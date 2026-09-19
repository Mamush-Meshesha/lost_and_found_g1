const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
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

    // brand: {
    //   type: String,
    //   default: null,
    //   trim: true,
    // },

    // model: {
    //   type: String,
    //   default: null,
    //   trim: true,
    // },

    // color: {
    //   type: String,
    //   default: null,
    //   trim: true,
    // },

    lostDate: {
      type: Date,
      required: true,
    },

    location: {
      address: {
        type: String,
        required: true,
      },

    //   coordinates: {
    //     type: [Number],
    //     default: null,
    //   },
    },

    images: [
      {
        type: String,
      },
    ],

    // Private information only the real owner should know
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

module.exports = mongoose.model("Item", itemSchema);