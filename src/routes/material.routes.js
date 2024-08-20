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
import { validateToken } from "../middlewares/validate-token.js";
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
materialRouter.post(
  "/new",
  validateToken,
  createMaterialValidations,
  ctrlCreateMaterial
);
materialRouter.patch(
  "/:materialId",
  validateToken,
  updateMaterialValidations,
  ctrlUpdateMaterial
);
materialRouter.delete(
  "/:materialId",
  deleteMaterialValidations,
  ctrlDeleteMaterial
);

export { materialRouter };
