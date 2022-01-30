import {model, Schema} from "mongoose";
import {Product} from "../../models/product";
import {logDebug} from "../logger/logger";

const MONGO_PRODUCTS_COLLECTION = 'products';
const MONGO_DB_NAME = 'ama-romach-db';

const productSchema = new Schema<Product>({
    name: {type: String, required: true},
    description: {type: String, required: true},
    image: {type: String, required: true},
    price: {type: Number, required: true},
    limit: {type: Number, required: false},
});

const ProductModel = model<Product>('Product', productSchema, MONGO_PRODUCTS_COLLECTION);

export const insertProductToDB = async (product: Product) => {
    const productDocument = new ProductModel(product);
    await productDocument.save();
    logDebug(`${product.name} product inserted to ${MONGO_DB_NAME} DB into ${MONGO_PRODUCTS_COLLECTION} collection`);
}

export const deleteProductFromDB = async (productName: string) => {
    const removedProduct = await ProductModel.findOneAndDelete({name: productName});
    logDebug(`${productName} product was deleted from ${MONGO_DB_NAME} DB from ${MONGO_PRODUCTS_COLLECTION} collection`);
}

export const deleteManyProductsFromDB = async (productsNames: string []) => {
    await ProductModel.deleteMany({name: {$in: productsNames}});
    logDebug(`${productsNames} products was deleted from ${MONGO_DB_NAME} DB from ${MONGO_PRODUCTS_COLLECTION} collection`);
}

export const updateProductInDB = async (product: Product) => {
    await ProductModel.findByIdAndUpdate({name: product.name}, product);
    logDebug(`${product.name} products was updated in ${MONGO_DB_NAME} DB in ${MONGO_PRODUCTS_COLLECTION} collection`);
}

export const getProductFromDB = async (productName: string): Promise<Product> => {
    const product = await ProductModel.findOne({name: productName}) as Product;
    logDebug(`Got ${productName} product from ${MONGO_DB_NAME} DB from ${MONGO_PRODUCTS_COLLECTION} collection`);
    return product;
}

export const getProductsFromDB = async (): Promise<Product[]> => {
    const products = await ProductModel.find() as Product[];
    logDebug(`Got all product from ${MONGO_DB_NAME} DB from ${MONGO_PRODUCTS_COLLECTION} collection`);
    return products;
}