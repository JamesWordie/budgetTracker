import { Schema, model, Types } from "mongoose";

const ExpenseSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide a expense name"],
      maxlength: 50,
      trim: true,
    },
    value: {
      type: Number,
      required: true,
    },
    createdBy: {
      type: Types.ObjectId,
      ref: "User",
      required: [true, "Please provide a user"],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = model("Expense", ExpenseSchema);
