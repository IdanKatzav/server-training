import Koa from "koa";
import {logDebug, logError, logInfo, logTrace} from "../resources/logger/logger";
import {Product} from "../models/product";


export const getProducts = async (ctx: Koa.Context) => {
    logInfo('Got request to get all the products in DB');

    try {
        //TODO: add get function from db
    } catch (err) {
        logError(`Couldn't get products because: ${err} `);
        ctx.status = 400;
        ctx.message = `${err}`;
    }
    ctx.status = 200;
    ctx.message = "Idan";
}

export const getSingleProduct = async (ctx: Koa.Context) => {
    const productName = ctx.params.name;
    logInfo(`Got new request to get product with name: ${productName}`);

    try {
        //TODO: add get function from db to specific product
    } catch (err) {
        logError(`Couldn't get products because: ${err} `);
        ctx.status = 400;
        ctx.message = `${err}`;
    }
    ctx.status = 200;
    ctx.message = "Idan";
}

export const insertProducts = async (ctx: Koa.Context) => {
    const productToInsert: Product = ctx.request.body;
    logInfo(`Got new Product to insert to DB with name ${productToInsert.name}`);
    logTrace(`Product to insert: ${JSON.stringify(productToInsert)}`)

    try {
        //TODO: create insert function to DB
    } catch (err) {
        logError(`Couldn't get products because: ${err} `);
        ctx.status = 400;
        ctx.message = `${err}`;
    }
    ctx.status = 200;
    ctx.message = "Idan";
}

export const removeProduct = async (ctx: Koa.Context) => {
    const productName = ctx.params.name;
    logInfo(`Got new request to delete product with name: ${productName}`);
    try {

    } catch (err) {
        logError(`Couldn't delete ${productName} product from DB because: ${err}`);
        ctx.status = 400;
        ctx.message = `${err}`;
    }
    ctx.status = 200;
    ctx.message = "Idan";
}

export const updateProduct = async (ctx: Koa.Context) => {
    const productToInsert: Product = ctx.request.body;

    logInfo(`Got new Product to update in DB with name ${productToInsert.name}`);
    logTrace(`Product to update: ${JSON.stringify(productToInsert)}`)
    try {
         // TODO: implement update product
    } catch (err) {
        logError(`Couldn't update ${productToInsert.name} product because: ${err}`);
        ctx.status = 400;
        ctx.message = `${err}`;
    }
    ctx.status = 200;
    ctx.message = "Idan";
}