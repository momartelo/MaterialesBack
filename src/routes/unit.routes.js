import { Router } from "express";
import {
  crtlUpdateUnit,
  ctrlCreateUnit,
  ctrlDeleteUnit,
  ctrlListAllUnits,
} from "../controllers/unit-controllers.js";
import {
  createUnitValidations,
  deleteUnitValidations,
  updateUnitValidations,
} from "../validations/unit-validatios.js";

const unitRouter = Router();

unitRouter.get("/", ctrlListAllUnits);
unitRouter.post("/new", createUnitValidations, ctrlCreateUnit);
unitRouter.patch("/:unitId", updateUnitValidations, crtlUpdateUnit);
unitRouter.delete("/:unitId", deleteUnitValidations, ctrlDeleteUnit);

export { unitRouter };
