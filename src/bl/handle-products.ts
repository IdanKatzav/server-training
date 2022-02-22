import Koa from "koa";
import {logError, logInfo, logTrace, logWarning} from "../resources/logger/logger";
import {Product} from "../models/product";
import {
    deleteManyProductsFromDB,
    deleteProductFromDB,
    getProductFromDB,
    getProductsFromDB,
    insertProductToDB,
    updateProductInDB
} from "./queries/products-queries";

export const getProducts = async (ctx: Koa.Context) => {
    logInfo('Got request to get all the products in DB');
    try {
        const products = await getProductsFromDB();
        logInfo(`The ${products} products sent to client`);
        logTrace(`Products: ${JSON.stringify(products)}`);
        ctx.ok(products);
    } catch (err) {
        logError(`Couldn't get products because: ${err}`);
        ctx.internalServerError();
    }

}

export const getSingleProduct = async (ctx: Koa.Context) => {
    const productName = ctx.params.name;
    logInfo(`Got new request to get product with name: ${productName}`);

    try {
        const product = await getProductFromDB(productName);
        if(!!product) {
            ctx.ok(product);
            logInfo(`The ${productName} product sent to client`);
            logTrace(`Product: ${JSON.stringify(product)}`);
        } else {
            ctx.notFound(`Cannot get ${productName} product`);
            logWarning(`${productName} product is not exist`);
        }
    } catch (err) {
        const failureMessage = `Couldn't get ${productName} product because, ${err}`;
        logError(failureMessage);
        ctx.internalServerError();
    }

}

export const insertProduct = async (ctx: Koa.Context) => {
    const productToInsert: Product = ctx.request.body;

    logInfo(`Got new Product to insert to DB with name ${productToInsert.name}`);
    logTrace(`Product to insert: ${JSON.stringify(productToInsert)}`)

    try {
        await insertProductToDB(productToInsert);
        logInfo(`${productToInsert.name} product inserted to DB successfully`);
        ctx.created(productToInsert);
    } catch (err) {
        const failureMessage = `Couldn't insert ${productToInsert.name} product because ${err}`;
        logError(failureMessage);
        ctx.internalServerError();
    }
}

export const deleteProduct = async (ctx: Koa.Context) => {
    const productName = ctx.params.name;
    logInfo(`Got new request to delete product with name: ${productName}`);
    try {
        await deleteProductFromDB(productName);
        logInfo(`${productName} product removed from DB successfully`);
        ctx.noContent();
    } catch (err) {
        logError(`Couldn't delete ${productName} product from DB because: ${err}`);
        ctx.internalServerError();
    }
}

export const updateProduct = async (ctx: Koa.Context) => {
    const productToUpdate: Product = ctx.request.body;

    logInfo(`Got new Product to update in DB with name ${productToUpdate.name}`);
    logTrace(`Product to update: ${JSON.stringify(productToUpdate)}`)
    try {
        await updateProductInDB(productToUpdate);
        logInfo(`${productToUpdate.name} product inserted to DB successfully`);
        ctx.ok(productToUpdate);
    } catch (err) {
        logError(`Couldn't update ${productToUpdate.name} product because: ${err}`);
        ctx.internalServerError();
    }
}

export const deleteProducts = async (ctx: Koa.Context) => {
    const productsToDelete: string[] = ctx.request.body;

    let deleteError;
    logInfo(`Got new Products list to delete from DB with names ${productsToDelete}`);
    logTrace(`Product to Delete: ${productsToDelete}`)
    try {
        deleteError = await deleteManyProductsFromDB(productsToDelete);
        logInfo(`${productsToDelete} product removed from DB successfully`);
        ctx.noContent();
    } catch (err) {
        deleteError = err;
    }

    if (deleteError) {
        logError(`Couldn't delete ${productsToDelete} products because: ${deleteError}`);
        ctx.inernalServerError();
    }
}