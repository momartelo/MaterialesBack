import { body, header, param } from "express-validator";
import { isValidObjectId } from "mongoose";
import { applyValidations } from "../middlewares/apply-validations.js";
import { CategoryModel } from "../models/Category.js";

export const createCategoryValidations = [
  body("category")
    .notEmpty()
    .withMessage("El campo { category } no puede estar vacio")
    .isString()
    .withMessage("El campo { category } debe ser un string")
    .custom(async (value) => {
      const categoryExist = await CategoryModel.findOne({ category: value });
      if (categoryExist) throw new Error("La categoria ya esta creada");
      return true;
    }),
  applyValidations,
];

export const updateCategoryValidatios = [
  param("categoryId")
    .notEmpty()
    .withMessage("El parametro { categoryId } no debe estar vacio.")
    .isString()
    .withMessage("El parametro { categoryId } debe ser un string.")
    .custom(isValidObjectId)
    .withMessage("El parametro { categoryId } debe ser una id valida."),
  body("category")
    .optional()
    .isString()
    .withMessage("El parametro { category } debe ser un string.")
    .custom(async (value) => {
      if (value) {
        const category = await CategoryModel.findOne({ category: value });
        if (category) throw new Error("El material ya esta en creado");
      }
      return true;
    }),
  applyValidations,
];

export const deleteCategoryValidations = [
  param("categoryId")
    .notEmpty()
    .withMessage("El parametro { categoryId } no debe estar vacio.")
    .isString()
    .withMessage("El parametro { categoryId } debe ser un string.")
    .custom(isValidObjectId)
    .withMessage("El parametro { categoryId } debe ser una id valida."),
  applyValidations,
];
