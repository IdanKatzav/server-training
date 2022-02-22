import {logError, logInfo, logTrace} from "../../resources/logger/logger";
import {
    deleteProductFromDB,
    getProductFromDB,
    getProductsFromDB,
    updateDBAfterCheckout,
    updateProductInDB
} from "../queries/products-queries";
import {Product} from "../../models/product";
import {CartUpdate} from "../../models/cart-update";
import {Session} from "koa-session";
import Koa from "koa";
import {deleteUserCart, getOccupiedItems, getUserCart} from "../../resources/cache/released-cache";
import {Cart} from "../../models/cart";


const getProductsResolver = async () => {
    logInfo('Got request to get all the products in DB');
    let products: Product[];
    try {
        products = await getProductsFromDB();
        logTrace(`Products from DB: ${JSON.stringify(products)}`);
    } catch (err) {
        logError(`Got error while getting products from DB, because: ${err}`);
        return err;
    }
    products.map(product => product.limit -= getOccupiedItems(product.name));
    logInfo(`Got all the products with their stock statuses from DB`);
    logTrace(`Products after update occupied: ${JSON.stringify(products)}`);
    return products;
}

const getProductResolver = async (productName: string) => {
    let product: Product;
    logInfo('Got request to get all the products in DB');
    try {
        product = await getProductFromDB(productName);
        logTrace(`Product from DB: ${JSON.stringify(product)}`);
    } catch (err) {
        logError(`Got error while getting products from DB, because: ${err}`);
        return err;
    }

    product.limit-= getOccupiedItems(productName);
    logInfo(`Got all the products with their stock statuses from DB`);
    logTrace(`Product after update occupied: ${JSON.stringify(product)}`);
    return product;
}

const updateProduct = async (ctx: Koa.Context, productToUpdate: CartUpdate) => {
    logInfo(`Got new Product to update with name ${productToUpdate.name}`);
    logTrace(`Product to update: ${JSON.stringify(productToUpdate)}`)
    try {
        await updateProductInDB(productToUpdate);
        logInfo(`${productToUpdate.name} product updated successfully`);
        ctx.ok(productToUpdate);
    } catch (err) {
        logError(`Couldn't update ${productToUpdate.name} product because: ${err}`);
        ctx.internalServerError();
    }
}

const deleteProduct = async (ctx: Koa.Context, productName: string) => {
    logInfo(`Got new request to delete product with name: ${productName}`);
    try {
        await deleteProductFromDB(productName);
        logInfo(`${productName} product removed from DB successfully`);
        ctx.noContent();
    } catch (err) {
        logError(`Couldn't delete ${productName} product from DB because: ${err}`);
        ctx.internalServerError();
    }
}

const checkout = async (userSession: Session) => {
    const userId = userSession.userId;
    logInfo(`Start checkout for user: ${userId}`)

    let productsInStore: Product[];
    const errMessage = `Error occurred while executing checkout action`;
    try {
        productsInStore = await getProductsFromDB();
    } catch (err) {
        logError(`${errMessage} for user: ${userId}, ${err}`);
        return new Error(errMessage);
    }

    const userCart = getUserCart(userId);
    const result = await updateProductsAfterCheckout(productsInStore, userCart);

    if (result instanceof Error) {
        logError(`${errMessage} for user: ${userId}, ${result}`);
        return new Error(errMessage);
    } else {
        deleteUserCart(userId);
        userSession = null;
        logInfo(`Checkout for user: ${userId} executed successfully`)
        return result;
    }
}

const updateProductsAfterCheckout = async (products: Product[], userCart: Cart): Promise<Product[]> => {
    const items = Object.keys(userCart);
    let productsToUpdate: Product[] = items.map((item) => {
        const product = products.find(product => item === product.name)
        product.limit -= userCart[item];
        return product;
    });

    productsToUpdate = await updateDBAfterCheckout(productsToUpdate);

    return productsToUpdate;
}

export const productResolvers = {
    Query: {
        products: getProductsResolver,
        product: async (parent, args, context, info) => {
            return await getProductResolver(args.productName);
        }
    },
    Mutation: {
        updateProduct: async (parent, args, context, info) => {
            return await updateProduct(context.ctx, args.product);
        },
        deleteProduct: async (parent, args, context, info) => {
            return await deleteProduct(context.ctx, args.productName);
        },
        checkout: async (parent, args, context, info) => {
            return await checkout(context.session);
        }
    }
}