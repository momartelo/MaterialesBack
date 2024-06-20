import { CategoryModel } from "../models/Category.js";
import { ObjectId } from "mongoose";
import { SubcategoryModel } from "../models/Subcategory.js";

export const ctrlCreateCategory = async (req, res) => {
  try {
    const { category } = req.body;
    const newCategory = new CategoryModel({ category });

    const existingCategory = await CategoryModel.findOne({
      category: newCategory.category,
    });
    if (!existingCategory) {
      await newCategory.save();
      return res
        .status(201)
        .json({ newCategory, message: "Categoria creada exitosamente" });
    } else {
      res.status(400).json({
        error: "Ya hay una categoria con el mismo nombre ingresado",
      });
    }
  } catch (error) {
    console.log("Error al crear la categoria", error);
    res.status(400).json({ error: "Problema con la BBDD" });
  }
};

export const ctrlListAllCategories = async (req, res) => {
  try {
    const categories = await CategoryModel.find();
    if (!categories) {
      return res.status(400).json({
        error: "No hay ninguna categoria en la BBDD",
      });
    } else {
      return res.status(200).json(categories);
    }
  } catch (error) {
    return res.status(500).json({ error: "No se puedo conectar con la BBDD" });
  }
};

export const crtlUpdateCategory = async (req, res) => {
  const { categoryId } = req.params;
  try {
    const category = await CategoryModel.findOne({ _id: categoryId });
    if (!category) {
      return res.status(404).json({ error: "Categoria no encontrada" });
    }
    category.set(req.body);
    await category.save();
    return res.status(200).json(category);
  } catch (error) {
    return res.status(500).json({ error: "No se puedo conectar con la BBDD" });
  }
};

export const ctrlDeleteCategory = async (req, res) => {
  const { categoryId } = req.params;

  try {
    const category = await CategoryModel.findOne({ _id: categoryId });

    if (!category) {
      return res.status(404).json({ error: "Categoria no encontrado" });
    }

    await SubcategoryModel.deleteMany({ _id: { $in: category.subcategory } });

    await CategoryModel.deleteOne({
      _id: categoryId,
    });
    return res.status(200).json(category);
  } catch (error) {
    return res.status(500).json({ error: "No se puedo conectar con la BBDD" });
  }
};
