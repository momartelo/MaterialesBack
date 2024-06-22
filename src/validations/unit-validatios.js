import { body, header, param } from "express-validator";
import { isValidObjectId } from "mongoose";
import { applyValidations } from "../middlewares/apply-validations.js";
import { UnitModel } from "../models/Unit.js";

export const createUnitValidations = [
  body("unit")
    .notEmpty()
    .withMessage("El campo { unit } no puede estar vacio")
    .isString()
    .withMessage("El campo { unit } debe ser un string")
    .custom(async (value) => {
      const unit = await UnitModel.findOne({ unit: value });
      if (unit) throw new Error("La unidad ya esta en creada");
      return true;
    }),
  applyValidations,
];

export const updateUnitValidations = [
  param("unitId")
    .notEmpty()
    .withMessage("El parametro { unitId } no debe estar vacio.")
    .isString()
    .withMessage("El parametro { unitId } debe ser un string.")
    .custom(isValidObjectId)
    .withMessage("El parametro { unitId } debe ser una id valida."),
  body("unit")
    .optional()
    .isString()
    .withMessage("El campo { unit } debe ser un string")
    .custom(async (value) => {
      const unit = await UnitModel.findOne({ unit: value });
      if (unit) throw new Error("El material ya esta en creado");
      return true;
    }),
  applyValidations,
];

export const deleteUnitValidations = [
  param("unitId")
    .notEmpty()
    .withMessage("El parametro { unitId } no debe estar vacio.")
    .isString()
    .withMessage("El parametro { unitId } debe ser un string.")
    .custom(isValidObjectId)
    .withMessage("El parametro { unitId } debe ser una id valida."),
  applyValidations,
];
