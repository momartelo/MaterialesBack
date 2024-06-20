import { Router } from "express";
import {
  crtlUpdateCategory,
  ctrlCreateCategory,
  ctrlDeleteCategory,
  ctrlListAllCategories,
} from "../controllers/category-controllers.js";
import {
  createCategoryValidations,
  deleteCategoryValidations,
  updateCategoryValidatios,
} from "../validations/category-validations.js";

const categoryRouter = Router();

categoryRouter.get("/", ctrlListAllCategories);
categoryRouter.post("/new", createCategoryValidations, ctrlCreateCategory);
categoryRouter.patch(
  "/:categoryId",
  updateCategoryValidatios,
  crtlUpdateCategory
);
categoryRouter.delete(
  "/:categoryId",
  deleteCategoryValidations,
  ctrlDeleteCategory
);

export { categoryRouter };
