import Koa from 'koa';
import bodyParser from "koa-bodyparser";
import {productsRouter} from "./routers/products-router";
import {loggerMiddleware} from "./middleware-functions";
import cors from "@koa/cors";
import nconf from "nconf";
const respond = require('koa-respond');
export const app = new Koa();

const allowedList = nconf.get('server:allowedList')
app.use(bodyParser());
app.use(loggerMiddleware);
app.use(cors({origin: allowedList}));
app.use(respond());
app.use(productsRouter.routes());
