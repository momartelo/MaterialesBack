import { Router } from "express";
import { crtlUpdateCategory, ctrlCreateCategory, ctrlDeleteCategory, ctrlListAllCategories } from "../controllers/category-controllers.js";

const categoryRouter = Router();

categoryRouter.get('/', ctrlListAllCategories);
categoryRouter.post('/new', ctrlCreateCategory);
categoryRouter.patch('/:categoryId', crtlUpdateCategory);
categoryRouter.delete('/:categoryId', ctrlDeleteCategory);

export { categoryRouter }