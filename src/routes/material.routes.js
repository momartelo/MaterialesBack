import { Router } from "express";
import {
  ctrlCreateMaterial,
  ctrlDeleteMaterial,
  ctrlGetMaterial,
  ctrlGetMaterialByCategoryAndSubcategory,
  ctrlGetMaterialsByCategory,
  ctrlListAllMaterials,
  ctrlUpdateMaterial,
} from "../controllers/material-controller.js";
import {
  createMaterialValidations,
  deleteMaterialValidations,
  getMaterialsByCategoryValidations,
  getMaterialValidations,
  updateMaterialValidations,
} from "../validations/material-validations.js";

const materialRouter = Router();

materialRouter.get("/", ctrlListAllMaterials);
materialRouter.get("/get/:materialId", getMaterialValidations, ctrlGetMaterial);
materialRouter.get(
  "/by/:categoryId",
  getMaterialsByCategoryValidations,
  ctrlGetMaterialsByCategory
);
materialRouter.get(
  "/cat/:categoryId/:subcategoryId",
  ctrlGetMaterialByCategoryAndSubcategory
);
materialRouter.post("/new", createMaterialValidations, ctrlCreateMaterial);
materialRouter.patch(
  "/:materialId",
  updateMaterialValidations,
  ctrlUpdateMaterial
);
materialRouter.delete(
  "/:materialId",
  deleteMaterialValidations,
  ctrlDeleteMaterial
);

export { materialRouter };
