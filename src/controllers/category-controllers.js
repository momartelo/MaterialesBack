import { CategoryModel } from "../models/Category.js";
import { ObjectId } from "mongoose";
import { SubcategoryModel } from "../models/Subcategory.js";
import { MaterialModel } from "../models/Material.js";

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
    // Encuentra la categoría por su ID y popula las subcategorías
    const category = await CategoryModel.findOne({ _id: categoryId }).populate(
      "subcategories"
    );

    // Si la categoría no existe, retorna un error 404
    if (!category) {
      return res.status(404).json({ error: "Categoria no encontrada" });
    }

    //Nuevo
    // Encuentra todas las subcategorías asociadas a la categoría
    const subcategoryIds = category.subcategories
      ? category.subcategories.map((subcategory) => subcategory._id)
      : [];

    //Nuevo
    // Elimina todos los materiales asociados a la categoría
    await MaterialModel.deleteMany({ category: categoryId });

    //Nuevo
    // Encuentra y elimina todos los materiales asociados a las subcategorías
    await MaterialModel.deleteMany({ subcategory: { $in: subcategoryIds } });

    //Nuevo
    // Elimina todas las subcategorías asociadas a la categoría
    if (subcategoryIds.length > 0) {
      const deleteResult = await SubcategoryModel.deleteMany({
        _id: { $in: subcategoryIds },
      });
      // Depuración: Muestra el resultado de la eliminación
      console.log(
        "Resultado de la eliminación de subcategorías:",
        deleteResult
      );
    }

    // // Elimina todas las subcategorías asociadas a la categoría
    // const deleteResult = await SubcategoryModel.deleteMany({
    //   _id: { $in: category.subcategories },
    // });

    // Elimina la categoría
    await CategoryModel.deleteOne({ _id: categoryId });

    // Retorna la categoría eliminada
    return res
      .status(200)
      .json({ message: "Categoría eliminada exitosamente" });
  } catch (error) {
    // Maneja errores de conexión a la base de datos
    console.error("Error al eliminar la categoría:", error);
    return res.status(500).json({ error: "No se pudo conectar con la BBDD" });
  }
};

// export const ctrlDeleteCategory = async (req, res) => {
//   const { categoryId } = req.params;

//   try {
//     const category = await CategoryModel.findOne({ _id: categoryId }).populate(
//       "subcategories"
//     );

//     if (!category) {
//       return res.status(404).json({ error: "Categoria no encontrado" });
//     }

//     console.log("Subcategorías encontradas:", category.subcategories);

//     const deleteResult = await SubcategoryModel.deleteMany({
//       _id: { $in: category.subcategories },
//     });

//     // Depuración: Muestra el resultado de la eliminación
//     console.log("Resultado de la eliminación de subcategorías:", deleteResult);

//     await CategoryModel.deleteOne({
//       _id: categoryId,
//     });
//     return res.status(200).json(category);
//   } catch (error) {
//     return res.status(500).json({ error: "No se puedo conectar con la BBDD" });
//   }
// };
