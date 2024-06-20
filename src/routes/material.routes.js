import { Router } from "express";
import {
  ctrlCreateMaterial,
  ctrlDeleteMaterial,
  ctrlGetMaterial,
  ctrlListAllMaterials,
  ctrlUpdateMaterial,
} from "../controllers/material-controller.js";
import { createMaterialValidations, deleteMaterialValidations, getMaterialValidations, updateMaterialValidations } from "../validations/material-validations.js";

const materialRouter = Router();

materialRouter.get("/", ctrlListAllMaterials);
materialRouter.get("/:materialId", getMaterialValidations, ctrlGetMaterial);
materialRouter.post("/new", createMaterialValidations ,ctrlCreateMaterial);
materialRouter.patch("/:materialId", updateMaterialValidations ,ctrlUpdateMaterial);
materialRouter.delete("/:materialId",  deleteMaterialValidations ,ctrlDeleteMaterial);

export { materialRouter };
