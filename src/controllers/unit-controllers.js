import { validationResult } from "express-validator";
import { UnitModel } from "../models/Unit.js";

export const ctrlCreateUnit = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { unit } = req.body;

    if (!unit) {
      return res.status(400).json({ message: "El campo unit es obligatorio" });
    }

    const newUnit = new UnitModel({ unit });

    await newUnit.save();

    res
      .status(200)
      .json({ message: "Unidad craeda exitosamente", unit: newUnit });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al crear la unidad", error: error.message });
  }
};

export const ctrlListAllUnits = async (req, res) => {
  try {
    const allUnits = await UnitModel.find();
    if (allUnits.length === 0) {
      res
        .status(404)
        .json({ error: "No hay unidades creadas en la base de datos" });
    }
    return res.status(200).json(allUnits);
  } catch (error) {
    return res
      .status(500)
      .json({ error: "No se puedo conectar con la base de datos" });
  }
};

export const crtlUpdateUnit = async (req, res) => {
  const { unitId } = req.params;
  try {
    const { unit } = req.body;

    const updateUnit = await UnitModel.findOne({ _id: unitId });
    if (!updateUnit) {
      return res.status(404).json({ error: "Unidad no encontrada" });
    }

    updateUnit.unit = unit;
    updateUnit.slug = unit.replace(/\s+/g, "-").toLowerCase();

    await updateUnit.save();

    res
      .status(200)
      .json({ message: "Unidad actualizada existosamente", unit: updateUnit });
  } catch (error) {
    return res
      .status(500)
      .json({ error: "No se puedo conectar con la base de datos" });
  }
};

export const ctrlDeleteUnit = async (req, res) => {
  const { unitId } = req.params;
  try {
    const unit = await UnitModel.findById(unitId);

    if (!unit) {
      return res.status(404).json({ error: "Unidad no encontrada" });
    }

    await UnitModel.deleteOne({ _id: unitId });
    return res.status(200).json({ message: "Unidad eliminada exitosamente" });
  } catch (error) {
    return res
      .status(500)
      .json({ error: "No se pudo conectar con la base de datos" });
  }
};
