import {startSession} from "mongoose";
import {Product} from "../../models/product";
import {logDebug} from "../../resources/logger/logger";
import nconf from "nconf";
import {ClientSession} from "mongodb";
import {ProductModel} from "../../resources/mongoDB/mongo-models";

const productsCollection = nconf.get('mongoDB:collection:products');
const dbName = nconf.get('mongoDB:db');

export const insertProductToDB = async (product: Product) => {
    const productDocument = new ProductModel(product);
    await productDocument.save();
    logDebug(`${product.name} product inserted to ${dbName} DB into ${productsCollection} collection`);
}

export const deleteProductFromDB = async (productName: string) => {
    await ProductModel.findOneAndDelete({name: productName});
    logDebug(`${productName} product was deleted from ${dbName} DB from ${productsCollection} collection`);
}

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

export const updateProductInDB = async (product: Partial<Product>) => {
    await ProductModel.findOneAndUpdate({name: product.name}, product);
    logDebug(`${product.name} products was updated in ${dbName} DB in ${productsCollection} collection`);
}

export const updateDBAfterCheckout = async (productsToUpdate: Product[]) :Promise<Product[]> => {
    let session: ClientSession = await startSession();
    try {
        session.startTransaction();
        const updatePromises = productsToUpdate.map(
            (product) => (ProductModel.findOneAndUpdate({name: product.name}, product, {session})));

        await Promise.all(updatePromises);
        await session.commitTransaction();
        return productsToUpdate;
    } catch (err) {
        await session.abortTransaction();
        return err;
    } finally {
        await session.endSession();
        logDebug(`All products ${productsToUpdate.map(productsToUpdate => productsToUpdate.name)} were updated in DB`);
    }
}

export const getProductFromDB = async (productName: string): Promise<Product> => {
    const product = await ProductModel.findOne({name: productName}, {'_id': 0, '__v': 0});
    logDebug(`Got ${productName} product from ${dbName} DB from ${productsCollection} collection`);
    return product as Product;
}

export const getProductsFromDB = async (): Promise<Product[]> => {
    const products = await ProductModel.find({}, {'_id': 0, '__v': 0}) as Product[];
    logDebug(`Got all product from ${dbName} DB from ${productsCollection} collection`);
    return products;
}