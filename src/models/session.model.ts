import { model, Schema } from "mongoose";
import { ISession } from "../interfaces/exports.interfaces";

const SessionSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    valid: { type: Boolean, default: true },
    userAgent: { type: String },
  },
  { timestamps: true }
);

const Session = model<ISession>("Session", SessionSchema);

export default Session;
