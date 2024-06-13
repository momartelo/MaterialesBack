import { UserModel } from "../models/User.js";
import * as bcrypt from "bcrypt";
import { createJWT } from "../utils/jwt.js";

export const crtlCreaterUser = async (req, res) => {
  try {
    const user = new UserModel(req.body);
    await user.save();
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({
      error: "No se pudo crear el usuario",
    });
  }
};

export const crtlLoginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await UserModel.findOne({ email });
    if (!user) return res.status(404).json({ error: "Usuario no encontrado" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: "credencial Invalida" });

    const token = await createJWT({ userId: user._id });
    res.status(200).json({ token, user });
  } catch (error) {
    res.status(500).json({ error: "No se puede loguear el usuario" });
  }
};

export const ctrlUpdateUser = async (req, res) => {
  const { userId } = req.params;
  try {
    const updatedUser = await UserModel.findOne({ _id: userId });

    if (!updatedUser) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }
    updatedUser.set(req.body);
    await updatedUser.save();
    return res.status(200).json(updatedUser);
  } catch (error) {
    return res.status(500).json({ error: "No se puedo conectar con la BBDD" });
  }
};

export const ctrlDeleteUser = async (req, res) => {
  const { userId } = req.params;
  try {
    const deleteUser = await UserModel.findOne({ _id: userId });
    if (!deleteUser) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }
    await UserModel.deleteOne({
      _id: userId,
    });
    return res.status(200).json(deleteUser);
  } catch (error) {
    return res.status(500).json({ error: "No se puedo conectar con la BBDD" });
  }
};
