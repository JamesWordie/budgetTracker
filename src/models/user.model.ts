// External
import { Schema, model } from "mongoose";
import bcrypt from "bcryptjs";
// Config
import {
  IUser,
  IUserMethods,
  UserModel,
} from "../interfaces/exports.interfaces";

/**
 * @class UserSchema
 * setup of the user model
 */
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

/**
 * pre saving the user encrypt and hash the password
 */
UserSchema.pre("save", async function () {
  const saltFactor = process.env.SALT_FACTOR
    ? parseInt(process.env.SALT_FACTOR)
    : 10;

  if (!this.isModified("password")) return;

  const salt = await bcrypt.genSalt(saltFactor);

  this.password = await bcrypt.hash(this.password, salt);
});

/**
 * function to generate a username for the user
 */
UserSchema.methods.username = function () {
  let randomNumber = Math.floor(Math.random() * 10_000);
  return this.firstname.slice(0, 3) + this.surname.slice(0, 3) + randomNumber;
};

/**
 * method to compare the password to ensure a match is entered between raw and the hashed version
 */
UserSchema.methods.comparePassword = async function (currentPassword) {
  const isMatch = await bcrypt.compare(currentPassword, this.password);
  return isMatch;
};

const User = model<IUser, UserModel>("User", UserSchema);

export default User;
