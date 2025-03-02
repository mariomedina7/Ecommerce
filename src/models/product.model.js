import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const productsCollection = "products";

const productSchema = new mongoose.Schema({
    title: String,
    description: String,
    code: String,
    price: Number,
    stock: Number,
    category: String,
    thumbnails: [{
        type: String,
        default: []
    }],
    status: Boolean
})

productSchema.plugin(mongoosePaginate);
export const productModel = mongoose.model(productsCollection, productSchema);