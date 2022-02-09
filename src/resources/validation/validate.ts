import Koa from "koa";
import {logDebug, logWarning} from "../logger/logger";
import joi from "joi";

const extractInputData = (ctx: Koa.Context) => {
    let inputData;
    if (ctx.request.method === "GET" || ctx.request.method === "DELETE"){
        inputData = ctx.params.name ? ctx.params.name: null;

        if (ctx.request.method === "DELETE" && ctx.request.body) {
            inputData = ctx.request.body;
        }
    } else {
        inputData = ctx.request.body;
    }

    return inputData;
}

export const validateInput = (schema: joi.Schema) => async (ctx: Koa.Context, next: any) => {
    const inputData = extractInputData(ctx);
    const validation = schema.validate(inputData);
    const productNames = typeof inputData === "object" ? inputData.name : inputData;

    if(!!validation.error){
        const errorMessage = `Cannot validate ${ productNames } product names because ${validation.error}`;
        logWarning(errorMessage);
        ctx.badRequest(errorMessage);
    } else {
        logDebug(`${productNames} product is valid`);
        await next();
    }
}