import Koa from "koa";

import {logDebug} from "../resources/logger/logger";

export const gotHttpRequest = (ctx: Koa.Context, next: any) => {
    logDebug(`Got new ${ctx.request.method} request to ${ctx.request.url}`);
    next();
}