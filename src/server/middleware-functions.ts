import Koa from "koa";

import {logDebug, logWarning} from "../resources/logger/logger";
import {productNamesArraySchema, productNameSchema, productsSchema} from "../resources/validation/validate";

export const gotHttpRequest = async (ctx: Koa.Context, next: any) => {
    logDebug(`Got new ${ctx.request.method} request to ${ctx.request.url}`);
    await next();
    logDebug(`Http response sent with statusCode: ${ctx.status} sent to client`)
}

export const checkProductValidation = async (ctx: Koa.Context, next: any) => {
    const product = ctx.request.body;
    const validation = productsSchema.validate(product);
    if(!!validation.error){
        const errorMessage = `Cannot validate product because ${validation.error}`;
        logWarning(errorMessage);
        ctx.badRequest(errorMessage);
    } else {
        logDebug(`${product.name} product is valid`);
        await next();
    }
}

export const checkProductNamesArrayValidation = async (ctx: Koa.Context, next: any) => {
    const productNames = ctx.request.body;
    const validation = productNamesArraySchema.validate(productNames);
    if(!!validation.error){
        const errorMessage = `Cannot validate ${ productNames } product names because ${validation.error}`;
        logWarning(errorMessage);
        ctx.badRequest(errorMessage);
    } else {
        logDebug(`${productNames} product is valid`);
        await next();
    }
}

export const checkProductNameValidation = async (ctx: Koa.Context, next: any) => {
    const productName = ctx.params.name;
    const validation = productNameSchema.validate(productName);
    if(!!validation.error){
        const errorMessage = `Cannot validate ${productName} product name because ${validation.error}`;
        logWarning(errorMessage);
        ctx.badRequest(errorMessage);
    } else {
        logDebug(`${productName} product is valid`);
        await next();
    }
}