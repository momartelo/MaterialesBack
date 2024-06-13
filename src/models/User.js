import { Schema, model, Types } from "mongoose";
import * as bcrypt from "bcrypt";
import {
  isValidEmail,
  isValidPassword,
} from "../validations/user-validations.js";

const UserSchema = new Schema(
  {
    avatar: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      validation: isValidEmail,
    },
    password: {
      type: String,
      required: true,
      validation: isValidPassword,
    },
    material: [
      {
        type: Types.ObjectId,
        ref: "Material",
      },
    ],
    isAdmin: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  const hash = await bcrypt.hash(this.password, 10);
  this.password = hash;
  next();
});

export const UserModel = model("User", UserSchema);
