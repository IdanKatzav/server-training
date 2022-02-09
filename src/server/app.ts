import Koa from 'koa';
import bodyParser from "koa-bodyparser";
const respond = require('koa-respond');
import { productsRouter } from "./routers/products-router";
import {loggerMiddleware} from "./middleware-functions";
export const app = new Koa();


app.use(bodyParser());
app.use(respond());
app.use(loggerMiddleware);
app.use(productsRouter.routes());
