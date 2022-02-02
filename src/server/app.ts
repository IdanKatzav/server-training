import Koa from 'koa';
import bodyParser from "koa-bodyparser";
const respond = require('koa-respond');

import productsRouter from "./products-router";
const app = new Koa();


app.use(bodyParser());
app.use(respond());
app.use(productsRouter.routes());

export default app;