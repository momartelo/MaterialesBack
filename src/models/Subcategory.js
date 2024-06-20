import { Schema, model, Types } from "mongoose";

const SubcategorySchema = new Schema({
  subcategory: {
    type: String,
    required: true,
    unique: true,
  },
  category: {
    type: Types.ObjectId,
    ref: "Category",
    required: true,
  },
  material: {
    type: Types.ObjectId,
    ref: "Material",
  },
  slug: {
    type: String,
    lowercase: true,
    unique: true,
  },
});

SubcategorySchema.pre("save", function (next) {
  const slug = this.subcategory.replace(/\s+/g, "-").toLowerCase();
  this.slug = slug;
  next();
});

export const SubcategoryModel = model("Subcategory", SubcategorySchema);
