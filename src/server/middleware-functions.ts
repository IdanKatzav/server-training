import Koa from "koa";
import {v4 as uuid} from 'uuid';

import {logDebug} from "../resources/logger/logger";
import {addUser} from "../resources/cache/released-cache";

export const loggerMiddleware = async (ctx: Koa.Context, next: any) => {
    logDebug(`Got new ${ctx.request.method} request to ${ctx.request.url} from user ${ctx.session.userId}`);
    await next();
    logDebug(`Http response sent with statusCode: ${ctx.status} sent to client ${ctx.session.userId}`)
}

export const sessionMiddleware = async (ctx: Koa.Context, next: any) => {
    if (!ctx.session.userId) {
        ctx.session.userId = uuid();
        logDebug(`New user logged in with id: ${ctx.session.userId}`);
        addUser(ctx.session.userId);
    }

    await next();
}