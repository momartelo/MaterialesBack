import { Router } from "express";
import {
  crtlLoginUser,
  crtlCreaterUser,
  ctrlUpdateUser,
  ctrlDeleteUser,
} from "../controllers/user-controller.js";
import {
  createUserValidations,
  loginUserValidations,
} from "../validations/user-validations.js";
import { authHeader } from "../validations/auth-validations.js";

const authRouter = Router();

authRouter.post("/login", loginUserValidations, crtlLoginUser);
authRouter.post("/register", createUserValidations, crtlCreaterUser);
authRouter.patch("/:userId", authHeader, ctrlUpdateUser);
authRouter.delete("/:userId", authHeader, ctrlDeleteUser);

export { authRouter };
