import { body, header, param } from "express-validator";
import { isValidObjectId } from "mongoose";
import { applyValidations } from "../middlewares/apply-validations.js";
import { MaterialModel } from "../models/Material.js";

export const createMaterialValidations = [
  body("name")
    .notEmpty()
    .withMessage("El campo { name } no puede estar vacio")
    .isString()
    .withMessage("El campo { name } debe ser un string")
    .custom(async (value) => {
      const material = await MaterialModel.findOne({ name: value });
      if (material) throw new Error("El material ya esta en creado");
      return true;
    }),
  body("precio")
    .notEmpty()
    .withMessage("El campo { precio } no puede estar vacio")
    .isFloat()
    .withMessage("El campo { precio } tiene que ser un numero"),
  body("moneda")
    .notEmpty()
    .withMessage("El campo { moneda } no puede estar vacio")
    .isString()
    .withMessage("El campo { moneda } debe ser ARS, EUR o USD"),
  body("unidad")
    .notEmpty()
    .withMessage("El campo { unidad } no puede estar vacio")
    .isString()
    .withMessage("El campo { unidad } debe ser un string"),
  applyValidations,
];

export const getMaterialValidations = [
  param("materialId")
    .notEmpty()
    .withMessage("El parametro { materialId } no debe estar vacio.")
    .isString()
    .withMessage("El parametro { materialId } debe ser un string.")
    .custom(isValidObjectId)
    .withMessage("El parametro { materialId } debe ser una id valida."),
  applyValidations,
];

export const updateMaterialValidations = [
  param("materialId")
    .notEmpty()
    .withMessage("El parametro { materialId } no debe estar vacio.")
    .isString()
    .withMessage("El parametro { materialId } debe ser un string.")
    .custom(isValidObjectId)
    .withMessage("El parametro { materialId } debe ser una id valida."),
  body("name")
    .optional()
    .isString()
    .withMessage("El parametro { name } debe ser un string.")
    .custom(async (value) => {
      if (value) {
        const material = await MaterialModel.findOne({ name: value });
        if (material) throw new Error("El material ya esta en creado");
      }
      return true;
    }),
  body("precio")
    .optional()
    .isFloat()
    .withMessage("El campo { precio } tiene que ser un numero"),
  body("moneda")
    .optional()
    .isString()
    .withMessage("El parametro { moneda } debe ser un string.")
    .custom((value) => {
      if (value && !["ARS", "EUR", "USD"].includes(value)) {
        throw new Error("La moneda debe ser ARS, EUR o USD");
      }
      return true;
    }),
  body("unidad")
    .optional()
    .isString()
    .withMessage("El parametro { unidad } debe ser un string."),
  applyValidations,
];

export const deleteMaterialValidations = [
  param("materialId")
    .notEmpty()
    .withMessage("El parametro { materialId } no debe estar vacio.")
    .isString()
    .withMessage("El parametro { materialId } debe ser un string.")
    .custom(isValidObjectId)
    .withMessage("El parametro { materialId } debe ser una id valida."),
  applyValidations,
];
