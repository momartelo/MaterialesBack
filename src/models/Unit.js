import { Schema, model, Types } from "mongoose";

const UnitSchema = new Schema({
  unit: {
    type: String,
    required: true,
    unique: true,
  },
  slug: {
    type: String,
    lowercase: true,
    unique: true,
  },
});

UnitSchema.pre("save", function (next) {
  const slug = this.unit.replace(/\s+/g, "-").toLowerCase();
  this.slug = slug;
  next();
});

export const UnitModel = model("Unit", UnitSchema);
