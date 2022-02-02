import Router from "koa-router";
import {
    getProducts,
    getSingleProduct,
    insertProducts,
    removeProduct,
    removeProducts,
    updateProduct
} from "./routing-functions";
import {
    checkProductNamesArrayValidation,
    checkProductNameValidation,
    checkProductValidation,
    gotHttpRequest
} from "./middleware-functions";

const routerOptions: Router.IRouterOptions = {
    prefix: '/products',
}
const productsRouter = new Router(routerOptions);

productsRouter.use(gotHttpRequest);


productsRouter.get(`/`, getProducts);

productsRouter.post('/', checkProductValidation, insertProducts);

productsRouter.get(`/:name`, checkProductNameValidation, checkProductNameValidation, getSingleProduct);

productsRouter.put(`/:name`, checkProductValidation, updateProduct);

productsRouter.delete(`/:name`, checkProductNameValidation, removeProduct);

productsRouter.delete(`/`, checkProductNamesArrayValidation, removeProducts);


export default productsRouter;
