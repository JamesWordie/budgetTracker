import { Schema, model } from "mongoose";
import bcrypt from "bcryptjs";
import {
  IUser,
  IUserMethods,
  UserModel,
} from "../interfaces/exports.interfaces";

const UserSchema = new Schema<IUser, UserModel, undefined, IUserMethods>(
  {
    firstname: {
      type: String,
      required: [true, "Please provide a first name"],
      maxlength: 50,
      minlength: 3,
    },
    surname: {
      type: String,
      required: [true, "Please provide a last name"],
      maxlength: 50,
      minlength: 3,
    },
    email: {
      type: String,
      required: [true, "Please provide an email"],
      match: [
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        "Please provide a valid email",
      ],
      unique: true,
    },
    password: {
      type: String,
      required: [true, "Please provide a password"],
      minlength: 6,
    },
  },
  { timestamps: true }
);

UserSchema.pre("save", async function () {
  const saltFactor = process.env.SALT_FACTOR
    ? parseInt(process.env.SALT_FACTOR)
    : 10;

  if (!this.isModified("password")) return;

  const salt = await bcrypt.genSalt(saltFactor);

  this.password = await bcrypt.hash(this.password, salt);
});

UserSchema.methods.username = function () {
  let randomNumber = Math.floor(Math.random() * 10_000);
  return this.firstname.slice(0, 3) + this.surname.slice(0, 3) + randomNumber;
};

UserSchema.methods.comparePassword = async function (currentPassword) {
  const isMatch = await bcrypt.compare(currentPassword, this.password);
  return isMatch;
};

const User = model<IUser, UserModel>("User", UserSchema);

export default User;
