import { Schema, model, Types } from "mongoose";
import * as bcrypt from "bcrypt";
import {
  isValidEmail,
  isValidPassword,
} from "../validations/user-validations.js";
import { publicPath } from "../../index.js";

const UserSchema = new Schema(
  {
    avatar: {
      type: String,
      default: ''
    },
    username: {
      type: String,
      required: true,
      unique: true,
    },
    genero: {
      type: String,
      required: true,
      enum: ["MASC", "FEM", "NO-BIN"],
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

  if (this.genero === "MASC") {
    this.avatar = `${publicPath}/img/avatar-hombre.png`;
  } else if (this.genero === "FEM") {
    this.avatar = '/img/avatar-mujer.png'; 
  } else if (this.genero === "NO-BIN") {
    this.avatar = '/img/avatar-no-binario.png'; 
  }

  const hash = await bcrypt.hash(this.password, 10);
  this.password = hash;
  next();
});

export const UserModel = model("User", UserSchema);
