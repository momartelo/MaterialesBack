import { Router } from "express";
import {
  ctrlCreateSubcategory,
  ctrlDeleteSubcategory,
  ctrlListAllSubcategories,
  ctrlUpdateSubcategory,
} from "../controllers/subcategory-controllers.js";
import {
  createSubcategoryValidations,
  deleteSubcategoryValidations,
  updateSubcategoryValidations,
} from "../validations/subcategory-validations.js";

const subcategoryRouter = Router();

subcategoryRouter.get("/", ctrlListAllSubcategories);
subcategoryRouter.post(
  "/new",
  createSubcategoryValidations,
  ctrlCreateSubcategory
);
subcategoryRouter.patch(
  "/:subcategoryId",
  updateSubcategoryValidations,
  ctrlUpdateSubcategory
);
subcategoryRouter.delete(
  "/:subcategoryId",
  deleteSubcategoryValidations,
  ctrlDeleteSubcategory
);

export { subcategoryRouter };
