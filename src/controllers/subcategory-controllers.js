import { SubcategoryModel } from "../models/Subcategory.js";
import { validationResult } from "express-validator";
import { Types } from "mongoose";
import { CategoryModel } from "../models/Category.js";

export const ctrlCreateSubcategory = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { subcategory, category, material } = req.body;

    // Verifica si la categoría existe por nombre
    const existingCategory = await CategoryModel.findOne({ category });
    if (!existingCategory) {
      return res.status(400).json({ error: "La categoría no existe" });
    }
    console.log("Categoria")
    console.log(existingCategory)

    const existingSubcategory = await SubcategoryModel.findOne({
      category: existingCategory._id,
      subcategory,
    });
    if (existingSubcategory) {
      return res.status(400).json({error: " Ya hay una subcategoria con el mismo nombre"});
    }

    console.log("Subcategoria")
    console.log(existingSubcategory)

    // Crea la nueva subcategoría
    const newSubcategory = new SubcategoryModel({
      subcategory,
      category: existingCategory._id,
      material,
    });
    console.log("Nueva Categoria")
    console.log(newSubcategory)
    await newSubcategory.save();
     // Agrega la nueva subcategoría al array de subcategorías de la categoría
    existingCategory.subcategories.push(newSubcategory._id);
    await existingCategory.save();

    res.status(201).json({ newSubcategory, message: "Subcategoría creada exitosamente" });
  } catch (error)  {
    // Manejo del error de clave duplicada en el índice compuesto
    if (error.code === 11000 && error.keyPattern && error.keyPattern.subcategory === 1 && error.keyPattern.category === 1) {
      return res.status(400).json({ error: "Ya existe una subcategoría con el mismo nombre en esta categoría" });
    }
    console.error("Error al crear la subcategoría:", error);
    res.status(500).json({ error: "Problema con la base de datos" });
  }
};

export const ctrlListAllSubcategories = async (req, res) => {
  try {
    const subcategories = await SubcategoryModel.find()
      .populate("category")
      .populate("material");
    if (subcategories.length === 0) {
      return res
        .status(404)
        .json({ error: "No hay ninguna subcategoría en la base de datos" });
    }
    return res.status(200).json(subcategories);
  } catch (error) {
    console.error("Error al listar las subcategorías:", error);
    return res
      .status(500)
      .json({ error: "No se pudo conectar con la base de datos" });
  }
};

export const ctrlUpdateSubcategory = async (req, res) => {
  const { subcategoryId } = req.params;
  try {
    const { subcategory: newSubcategory, category, material } = req.body;

    // Verifica si la categoría existe por nombre
    let categoryObjectId = undefined;
    if (category) {
      const existingCategory = await CategoryModel.findOne({ category });
      if (!existingCategory) {
        return res.status(400).json({ error: "La categoría no existe" });
      }
      categoryObjectId = existingCategory._id;
    }

    const subcategory = await SubcategoryModel.findById(subcategoryId);

    if (!subcategory) {
      return res.status(404).json({ error: "Subcategoría no encontrada" });
    }

    // Actualiza los campos de la subcategoría si se proporcionan
    if (newSubcategory) {
      subcategory.subcategory = newSubcategory;
    }
    if (categoryObjectId) {
      subcategory.category = categoryObjectId;
    }
    if (material) {
      subcategory.material = material;
    }

    await subcategory.save();
    return res.status(200).json(subcategory);
  } catch (error) {
    console.error("Error al actualizar la subcategoría:", error);
    return res
      .status(500)
      .json({ error: "No se pudo conectar con la base de datos" });
  }
};

export const ctrlDeleteSubcategory = async (req, res) => {
  const { subcategoryId } = req.params;

  try {
    const subcategory = await SubcategoryModel.findById(subcategoryId);
    console.log("Aca en el Delete")
    console.log(subcategory)
    console.log(subcategory.category)
    if (!subcategory) {
      return res.status(404).json({ error: "Subcategoría no encontrada" });
    }

    const category = await CategoryModel.findById(subcategory.category);
    if (!category) {
      return res.status(404).json({ error: "Categoria no encontrada" });
    }

    category.subcategories.pull(subcategoryId)
    await category.save()
 
    await SubcategoryModel.deleteOne({ _id: subcategoryId });
    return res
      .status(200)
      .json({ message: "Subcategoría eliminada exitosamente" });
  } catch (error) {
    console.error("Error al eliminar la subcategoría:", error);
    return res
      .status(500)
      .json({ error: "No se pudo conectar con la base de datos" });
  }
};
