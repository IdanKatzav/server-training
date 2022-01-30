import Koa from "koa";
import {logError, logInfo, logTrace} from "../resources/logger/logger";
import {Product} from "../models/product";
import {
    deleteManyProductsFromDB,
    deleteProductFromDB,
    getProductFromDB,
    getProductsFromDB,
    insertProductToDB, updateProductInDB
} from "../resources/mongoDB/mongoQueries";


export const getProducts = async (ctx: Koa.Context) => {
    logInfo('Got request to get all the products in DB');

    try {
        const products = await getProductsFromDB();
        ctx.status = 200;
        ctx.body = {products};
        logInfo(`The ${products} products sent to client`);
        logTrace(`Products: ${JSON.stringify(products)}`);
    } catch (err: any) {
        logError(`Couldn't get products because: ${err}`);
        ctx.status = err.statusCode || 500;
        ctx.message = `${err}`;
    }

}

export const getSingleProduct = async (ctx: Koa.Context) => {
    const productName = ctx.params.name;
    logInfo(`Got new request to get product with name: ${productName}`);

    try {
        const product = await getProductFromDB(productName);
        ctx.body = {product}
        ctx.status = 200;

        logInfo(`The ${productName} product sent to client`);
        logTrace(`Product: ${JSON.stringify(product)}`);
    } catch (err: any) {
        const failureMessage = `Couldn't get ${productName} product because, ${err}`;
        logError(failureMessage);
        ctx.status = err.statusCode || 500;
        ctx.message = failureMessage;
    }

}

export const insertProducts = async (ctx: Koa.Context) => {
    const productToInsert: Product = ctx.request.body;
    logInfo(`Got new Product to insert to DB with name ${productToInsert.name}`);
    logTrace(`Product to insert: ${JSON.stringify(productToInsert)}`)

    try {
        await insertProductToDB(productToInsert);
        logInfo(`${productToInsert.name} product inserted to DB successfully`);
        ctx.status = 201;
        ctx.body = {product: productToInsert};
    } catch (err: any) {
        const failureMessage = `Couldn't insert ${productToInsert.name} product because ${err}`;
        logError(failureMessage);
        ctx.status = err.statusCode || 500;
        ctx.message = failureMessage;
    }

}

export const removeProduct = async (ctx: Koa.Context) => {
    const productName = ctx.params.name;
    logInfo(`Got new request to delete product with name: ${productName}`);
    try {
        let removedProduct = await deleteProductFromDB(productName);
        logInfo(`${productName} product removed from DB successfully`);

        ctx.status = 204;
        ctx.body = {product: removedProduct};
    } catch (err: any) {
        const failureMessage = `Couldn't delete ${productName} product from DB because: ${err}`;
        logError(failureMessage);
        ctx.status = err.statusCode || 500;
        ctx.message = failureMessage;
    }
}

export const updateProduct = async (ctx: Koa.Context) => {
    const productToUpdate: Product = ctx.request.body;

    logInfo(`Got new Product to update in DB with name ${productToUpdate.name}`);
    logTrace(`Product to update: ${JSON.stringify(productToUpdate)}`)
    try {
        await updateProductInDB(productToUpdate);
        const successMessage = `${productToUpdate.name} product inserted to DB successfully`;
        logInfo(successMessage);
        ctx.status = 201;
        ctx.body = {product: productToUpdate};
    } catch (err: any) {
        logError(`Couldn't update ${productToUpdate.name} product because: ${err}`);
        ctx.status = err.statusCode || 500;
        ctx.message = `${err}`;
    }
}

export const removeProducts = async (ctx: Koa.Context) => {
    const productsToDelete: string[] = ctx.request.body;

    logInfo(`Got new Products list to delete from DB with names ${productsToDelete}`);
    logTrace(`Product to Delete: ${productsToDelete}`)
    try {
        await deleteManyProductsFromDB(productsToDelete);
        logInfo(`${productsToDelete} product removed from DB successfully`);
        ctx.status = 204;
        ctx.body = {productsNames: productsToDelete};
    } catch (err: any) {
        logError(`Couldn't delete ${productsToDelete} products because: ${err}`);
        ctx.status = err.statusCode || 500;
        ctx.message = `${err}`;
    }
}