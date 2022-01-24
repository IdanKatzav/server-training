import Koa from 'koa';
import bodyParser from "koa-bodyparser";

import productsRouter from "./products-router";
const app = new Koa();


app.use(bodyParser());

app.use(productsRouter.routes())

export default app;