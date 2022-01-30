import Koa from "koa";

import {logDebug} from "../resources/logger/logger";

export const gotHttpRequest = async (ctx: Koa.Context, next: any) => {
    logDebug(`Got new ${ctx.request.method} request to ${ctx.request.url}`);
    await next();
    logDebug(`Http response sent with statusCode: ${ctx.status} sent to client`)
}