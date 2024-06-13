import { Schema, model, Types } from "mongoose";

const CategorySchema = new Schema(
    {
        category: {
            type: String,
            required: true,
            unique: true,
    },
        material: {
            type: Types.ObjectId,
            ref: "Material" 
    },
        slug: {
            type: String,
            lowercase: true,
            unique: true,
    }, 
    })

    CategorySchema.pre('save', function (next) {
        const slug = this.category.replace(/\s+/g, '-').toLowerCase();
        this.slug = slug;
        next();
    });

    export const CategoryModel = model("Category", CategorySchema);