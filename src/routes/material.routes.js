import { Router } from "express";
import {
  ctrlCreateMaterial,
  ctrlDeleteMaterial,
  ctrlListAllMaterials,
  ctrlUpdateMaterial,
} from "../controllers/material-controller.js";

const materialRouter = Router();

materialRouter.get("/", ctrlListAllMaterials);
materialRouter.post("/new", ctrlCreateMaterial);
materialRouter.patch("/:materialId", ctrlUpdateMaterial);
materialRouter.delete("/:materialId", ctrlDeleteMaterial);

export { materialRouter };
