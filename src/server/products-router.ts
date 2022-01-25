import Router from "koa-router";
import {getProducts, getSingleProduct, insertProducts, removeProduct, updateProduct} from "./routing-functions";
import {gotHttpRequest} from "./middleware-functions";

const routerOptions : Router.IRouterOptions = {
    prefix: '/products',
}
const productsRouter = new Router(routerOptions);

productsRouter.use(gotHttpRequest);

productsRouter.get(`/`, getProducts);

productsRouter.post('/', insertProducts);

productsRouter.get(`/:name`, getSingleProduct);

productsRouter.put(`/:name`, updateProduct);

productsRouter.delete(`/:name`, removeProduct);

export default productsRouter;
