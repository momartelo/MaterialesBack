import { MaterialModel } from "../models/Material.js";
import { CategoryModel } from "../models/Category.js";
import { ObjectId } from "mongoose";
import { SubcategoryModel } from "../models/Subcategory.js";
import { UnitModel } from "../models/Unit.js";

export const ctrlCreateMaterial = async (req, res) => {
  try {
    const { image, name, precio, moneda, category, subcategory, unit } = req.body;
    console.log(image)
    console.log(name);
    console.log(precio);
    console.log(moneda);
    console.log(category);
    console.log(subcategory);
    console.log(unit);

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

    const unitExist = await UnitModel.findOne({ unit });
    if (!unitExist) {
      return res.status(400).json({ error: "Unidad no encontrada" });
    }

    console.log(unitExist);

    const material = new MaterialModel({
      image,
      name,
      precio,
      moneda,
      category: categoryExist._id,
      subcategory: subcategoryExist._id,
      unit: unitExist._id,
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
  const { materialId } = req.params;
  console.log(materialId);

  try {
    const material = await MaterialModel.findOne({ _id: materialId }); //si no funciona poner directamente el params
    console.log(material);
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

    const updatedFields = req.body;
    for (const field in updatedFields) {
      material.set(field, updatedFields[field]); // version para actualizar solo los campos modificados
    }

    // material.set(req.body); // version anterior
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
    return res.status(200).json({ material, message: "Material eliminado" }); //modificado revisar
  } catch (error) {
    return res.status(500).json({ error: "No se puedo conectar con la BBDD" });
  }
};

//-----------------Filtrar por categoria-----------------//

export const ctrlGetMaterialsByCategory = async (req, res) => {
  const { categoryId } = req.params;
  console.log(categoryId);
  try {
    // const objectId = new ObjectId(idParams);
    const materialsFiltered = await MaterialModel.find({
      category: categoryId,
    });

    if (!materialsFiltered) {
      return res
        .status(404)
        .json({ error: "No hay materiales dentro de la categoria" });
    }
    return res.status(200).json(materialsFiltered);
  } catch (error) {
    return res.status(500).json({ error: "No se puedo conectar con la BBDD" });
  }
};

//-----------------Filtrar por categoria y subcategoria-----------------//

export const ctrlGetMaterialByCategoryAndSubcategory = async (req, res) => {
  try {
    const { categoryId, subcategoryId } = req.params;

    const category = await CategoryModel.findById({ _id: categoryId });
    const subcategory = await SubcategoryModel.findById({ _id: subcategoryId });

    if (!category) {
      return res.status(404).json({ message: "Categoria no encontrada" });
    }
    if (!subcategory) {
      return res.status(404).json({ message: "Subcategoria no encontrada" });
    }

    const materials = await MaterialModel.find({
      category: categoryId,
      subcategory: subcategoryId,
    });

    res.status(200).json(materials);
  } catch (error) {
    res.status(500).json({ message: "Error fetching materials", error });
  }
};
