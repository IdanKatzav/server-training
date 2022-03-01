import Koa from "koa";
import {v4 as uuid} from 'uuid';

import {logDebug, logWarning} from "../resources/logger/logger";
import {addUser, getUserCart} from "../resources/cache/released-cache";

export const loggerMiddleware = async (ctx: Koa.Context, next: any) => {
    if (!!ctx.request.body && ctx.request.body.operationName !== 'IntrospectionQuery') {
        logDebug(`Got new ${ctx.request.method} request to ${ctx.request.url} from user ${ctx.headers.authorization}`);
        await next();
        logDebug(`Http response sent with statusCode: ${ctx.status} sent to client ${ctx.headers.authorization}`);
    } else {
        await next();
    }

}

export const sessionMiddleware = async (ctx: Koa.Context, next: any) => {
    if (!ctx.session.userId) {
        ctx.session.userId = uuid();

        logDebug(`New user logged in with id: ${ctx.session.userId}`);
        addUser(ctx.session.userId);
    } else {
        if (!getUserCart(ctx.session.userId)) {
            addUser(ctx.session.userId);
        }
    }

    await next();
}

export const identificationMiddleware = async (ctx: Koa.Context, next: any) => {
    const userId = ctx.headers.authorization;

    if (!!userId) {
        if (!getUserCart(userId)) {
            logDebug(`New user logged in with id: ${userId}`);
            addUser(userId);
        }
        await next();
    } else {
        logWarning('Unauthorized user tried to connect');
        // return new Error('Unauthorized');
        await next();
    }
}