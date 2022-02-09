import {model, Schema, startSession} from "mongoose";
import {Product} from "../../models/product";
import {logDebug, logError} from "../logger/logger";
import nconf from "nconf";
import { ClientSession } from "mongodb";

const productsCollection = nconf.get('mongoDB:collection');
const dbName = nconf.get('mongoDB:db');

const productSchema = new Schema<Product>({
    name: {type: String, required: true, unique: true, index: true},
    description: {type: String, required: true},
    image: {type: String, required: true},
    price: {type: Number, required: true},
    limit: {type: Number, required: false},
}, {strict: true});

const ProductModel = model<Product>('Product', productSchema, productsCollection);

export const insertProductToDB = async (product: Product) => {
    const productDocument = new ProductModel(product);
    await productDocument.save();
    logDebug(`${product.name} product inserted to ${dbName} DB into ${productsCollection} collection`);
}

export const deleteProductFromDB = async (productName: string) => {
    await ProductModel.findOneAndDelete({name: productName});
    logDebug(`${productName} product was deleted from ${dbName} DB from ${productsCollection} collection`);
}

// export const deleteManyProductsFromDB = async (productsNames: string []) => {
//     await ProductModel.deleteMany({name: {$in: productsNames}});
//     logDebug(`${productsNames} products was deleted from ${dbName} DB from ${productsCollection} collection`);
// }

export const deleteManyProductsFromDB = async (productsNames: string []) => {
    let session: ClientSession = await startSession();

    try {
        session.startTransaction();
        const deletePromises = productsNames.map(
            (name) => (ProductModel.findOneAndDelete({name}, {session})));

        await Promise.all(deletePromises);
        await session.commitTransaction();
    } catch (err) {
        await session.abortTransaction();
        return err;
    } finally {
        await session.endSession();
    }
}

export const updateProductInDB = async (product: Product) => {
    await ProductModel.findByIdAndUpdate({name: product.name}, product);
    logDebug(`${product.name} products was updated in ${dbName} DB in ${productsCollection} collection`);
}

export const getProductFromDB = async (productName: string): Promise<Product> => {
    const product = await ProductModel.findOne({name: productName}) as Product;
    logDebug(`Got ${productName} product from ${dbName} DB from ${productsCollection} collection`);
    return product;
}

export const getProductsFromDB = async (): Promise<Product[]> => {
    const products = await ProductModel.find() as Product[];
    logDebug(`Got all product from ${dbName} DB from ${productsCollection} collection`);
    return products;
}