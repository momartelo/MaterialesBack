import { body } from "express-validator";
import { applyValidations } from "../middlewares/apply-validations.js";
import { UserModel } from "../models/User.js";

export const createUserValidations = [
  body("avatar")
    .notEmpty()
    .withMessage("El campo { avatar } no puede estar vacio")
    .isString()
    .withMessage("El campo { avatar } debe ser un string")
    .isURL()
    .withMessage("El campo { avatar } debe ser una URL"),
  body("email")
    .notEmpty()
    .withMessage("El campo { email } no puede estar vacio")
    .isEmail()
    .withMessage("El campo { email } debe ser un email valido")
    .custom(async (value) => {
      const user = await UserModel.findOne({ email: value });
      if (user) throw new Error("Email ya esta en uso");
      return true;
    }),
  body("username")
    .notEmpty()
    .withMessage("El campo { username } no puede estar vacio")
    .isString()
    .withMessage("El campo { username } debe ser un string")
    .custom(async (value) => {
      const user = await UserModel.findOne({ username: value });
      if (user) throw new Error("Usuario ya esta en uso");
      return true;
    }),
  body("password")
    .notEmpty()
    .withMessage("El campo { password } no puede estar vacio")
    .isString()
    .withMessage("El campo { password } debe ser un string"),
  applyValidations,
];

export const loginUserValidations = [
  body("email")
    .notEmpty()
    .withMessage("El campo { email } no puede estar vacio")
    .isEmail()
    .withMessage("El campo { email } debe ser un email valido")
    .custom(async (value) => {
      const user = await UserModel.findOne({ email: value });
      if (user) throw new Error("Email ya esta en uso");
      return true;
    }),
  body("password")
    .notEmpty()
    .withMessage("El campo { password } no puede estar vacio")
    .isString()
    .withMessage("El campo { password } debe ser un string"),
];

export const isValidEmail = (email) => {
  const REGEX_EMAIL = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-z]{2,6}$/;
  return REGEX_EMAIL.test(email);
};

export const isValidPassword = (password) => {
  const REGEX_PASSWORD =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9]{4,})(?=.*[!?@#$%^&*()_+]).{8,}$/;
  return REGEX_PASSWORD.test(password);
};
