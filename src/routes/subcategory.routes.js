import { Router } from "express";
import { ctrlCreateSubcategory, ctrlDeleteSubcategory, ctrlListAllSubcategories, ctrlUpdateSubcategory } from "../controllers/subcategory-controllers.js";

const subcategoryRouter = Router()

subcategoryRouter.get("/", ctrlListAllSubcategories);
subcategoryRouter.post("/new", ctrlCreateSubcategory);
subcategoryRouter.patch("/:subcategoryId", ctrlUpdateSubcategory);
subcategoryRouter.delete("/:subcategoryId", ctrlDeleteSubcategory);

export { subcategoryRouter }