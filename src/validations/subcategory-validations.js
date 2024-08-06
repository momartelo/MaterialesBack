import { body, header, param } from "express-validator";
import { isValidObjectId } from "mongoose";
import { applyValidations } from "../middlewares/apply-validations.js";
import { SubcategoryModel } from "../models/Subcategory.js";
import { CategoryModel } from "../models/Category.js";

export const createSubcategoryValidations = [
  body("subcategory")
    .notEmpty()
    .withMessage("El campo { subcategory } no puede estar vacio")
    .isString()
    .withMessage("El campo { subcategory } debe ser un string")
    // .custom(async (value) => {
    //   const subCategoryExist = await SubcategoryModel.findOne({
    //     subcategory: value,
    //   });
    //   const categoryExist = await CategoryModel.findOne({
    //     category: value,
    //   });
      
    //   if (subCategoryExist && categoryExist) throw new Error("La subcategoria ya esta creada");
    //   return true;
           

    // })
    ,
  body("category")
    .notEmpty()
    .withMessage("El campo { category } no puede estar vacio")
    .isString()
    .withMessage("El campo { category } debe ser un string"),
  applyValidations,
];

export const updateSubcategoryValidations = [
  param("subcategoryId")
    .notEmpty()
    .withMessage("El parametro { subcategoryId } no debe estar vacio.")
    .isString()
    .withMessage("El parametro { subcategoryId } debe ser un string.")
    .custom(isValidObjectId)
    .withMessage("El parametro { subcategoryId } debe ser una id valida."),
  body("subcategory")
    .optional()
    .isString()
    .withMessage("El campo { subcategory } debe ser un string"),
    // .custom(async (value) => {
    //   const subCategoryExist = await SubcategoryModel.findOne({
    //     subcategory: value,
    //   });
    //   if (subCategoryExist) throw new Error("La subcategoria ya esta creada");
    //   return true;
    // }),
  body("category")
    .optional()
    .isString()
    .withMessage("El campo { category } debe ser un string"),
  applyValidations,
];

export const deleteSubcategoryValidations = [
  param("subcategoryId")
    .notEmpty()
    .withMessage("El parametro { subcategoryId } no debe estar vacio.")
    .isString()
    .withMessage("El parametro { subcategoryId } debe ser un string.")
    .custom(isValidObjectId)
    .withMessage("El parametro { subcategoryId } debe ser una id valida."),
  applyValidations,
];
