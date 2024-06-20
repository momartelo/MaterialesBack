import { MaterialModel } from "../models/Material.js";
import { CategoryModel } from "../models/Category.js";
import { ObjectId } from "mongoose";
import { SubcategoryModel } from "../models/Subcategory.js";

export const ctrlCreateMaterial = async (req, res) => {
  try {
    const { name, precio, moneda, category, subcategory } = req.body;
    console.log(name);
    console.log(precio);
    console.log(moneda);
    console.log(category);
    console.log(subcategory);

    const categoryExist = await CategoryModel.findOne({ category });
    if (!categoryExist) {
      return res.status(400).json({ error: "Categoria no encontrada" });
    }

    console.log(categoryExist);

    const subcategoryExist = await SubcategoryModel.findOne({ subcategory });
    if (!subcategoryExist) {
      return res.status(400).json({ error: "Subcategoria no encontrada" });
    }

    console.log(subcategoryExist);

    const material = new MaterialModel({
      name,
      precio,
      moneda,
      category: categoryExist._id,
      subcategory: subcategoryExist._id,
    });
    console.log(material);

    const existingMaterial = await MaterialModel.findOne({ name });
    if (!existingMaterial) {
      const newMaterial = await material.save();
      return res.status(201).json({
        message: "Material creado exitosamente",
        product: newMaterial,
      });
    } else {
      res.status(400).json({
        error: "Ya hay un material con el mismo nombre ingresado",
      });
    }
  } catch (error) {
    console.log("Error al crear material", error);
    res.status(400).json({
      error: "No se pudo crear el material",
    });
  }
};

export const ctrlListAllMaterials = async (req, res) => {
  try {
    const materials = await MaterialModel.find();
    if (!materials) {
      return res.status(400).json({
        error: "No hay ningun material en la BBDD",
      });
    } else {
      return res.status(200).json(materials);
    }
  } catch (error) {
    return res.status(500).json({ error: "No se puedo conectar con la BBDD" });
  }
};

export const ctrlGetMaterial = async (req, res) => {
  const { idParams } = req.params.materialId;
  try {
    const objectId = new ObjectId(idParams);
    const material = await MaterialModel.findById(objectId);

    if (!material) {
      return res.status(404).json({ error: "Material no encontrado" });
    }
    return res.status(200).json(material);
  } catch (error) {
    return res.status(500).json({ error: "No se puedo conectar con la BBDD" });
  }
};

export const ctrlUpdateMaterial = async (req, res) => {
  const { materialId } = req.params;
  console.log(materialId);
  try {
    const material = await MaterialModel.findOne({ _id: materialId });
    if (!material) {
      return res.status(404).json({ error: "Material no encontrado" });
    }
    material.set(req.body);
    await material.save();
    return res.status(200).json(material);
  } catch (error) {
    return res.status(500).json({ error: "No se puedo conectar con la BBDD" });
  }
};

export const ctrlDeleteMaterial = async (req, res) => {
  const { materialId } = req.params;
  try {
    const material = await MaterialModel.findOne({ _id: materialId });
    if (!material) {
      return res.status(404).json({ error: "Material no encontrado" });
    }
    await MaterialModel.deleteOne({
      _id: materialId,
    });
    return res.status(200).json(material);
  } catch (error) {
    return res.status(500).json({ error: "No se puedo conectar con la BBDD" });
  }
};
