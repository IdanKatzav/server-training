import Router from "koa-router";
import {
    getProducts,
    getSingleProduct,
    insertProduct,
    deleteProduct,
    deleteProducts,
    updateProduct
} from "../../bl/handle-products";
import {validateInput} from "../../resources/validation/validate";
import {
    productNamesArraySchema,
    productNameSchema,
    productsSchema
} from "../../resources/validation/validation-schemas";

const routerOptions: Router.IRouterOptions = {
    prefix: '/products',
}
export const productsRouter = new Router(routerOptions);

productsRouter.get(`/`, getProducts);

productsRouter.post('/', validateInput(productsSchema), insertProduct);

productsRouter.get(`/:name`, validateInput(productNameSchema), getSingleProduct);

productsRouter.put(`/:name`, validateInput(productsSchema), updateProduct);

productsRouter.delete(`/:name`, validateInput(productNameSchema), deleteProduct);

productsRouter.delete(`/`, validateInput(productNamesArraySchema), deleteProducts);
