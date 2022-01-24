import Router from "koa-router";

const routerOptions : Router.IRouterOptions = {
    prefix: '/products'
}
const productsRouter = new Router(routerOptions);

productsRouter.get(`/`, async (ctx) =>{

});

productsRouter.post('/', async () => {

});

productsRouter.get(`/:id`, async () =>{

});

productsRouter.put(`/:id`, async () =>{

});

productsRouter.delete(`/:id`, async () =>{

});

export default productsRouter;