import nconf from "nconf";
import {model, Schema} from "mongoose";
import {Product} from "../../models/product";

const productsCollection = nconf.get('mongoDB:collection:products');

const productSchema = new Schema<Product>({
    name: {type: String, required: true, unique: true, index: true},
    description: {type: String, required: true},
    image: {type: String, required: true},
    price: {type: Number, required: true},
    limit: {type: Number, required: false},
}, {strict: true});

export const ProductModel = model<Product>('Product', productSchema, productsCollection);
