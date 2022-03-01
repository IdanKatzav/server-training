import {logError, logInfo, logTrace} from "../../resources/logger/logger";
import {
    deleteProductFromDB,
    getProductFromDB,
    getProductsFromDB,
    updateDBAfterCheckout,
    updateProductInDB
} from "../queries/products-queries";
import {Product} from "../../models/product";
import Koa from "koa";
import {deleteUserCart, getOccupiedItems, getUserCart} from "../../resources/cache/released-cache";
import {Cart} from "../../models/cart";


const getProductsResolver = async () => {
    logInfo('Got request to get all the products in DB');
    let products: Product[];
    try {
        products = await getProductsFromDB();
    } catch (err) {
        logError(`Got error while getting products from DB, because: ${err}`);
        return new Error(`DB Error`);
    }

    logTrace(`Products from DB: ${JSON.stringify(products)}`);

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
    } catch (err) {
        logError(`Got error while getting products from DB, because: ${err}`);
        return new Error(`DB Error`);
    }
    if (!product) {
        return new Error(`Not Found`);
    }

    logTrace(`Product from DB: ${JSON.stringify(product)}`);

    product.limit -= getOccupiedItems(productName);

    logInfo(`Got all the products with their stock statuses from DB`);
    logTrace(`Product after update occupied: ${JSON.stringify(product)}`);
    return product;
}

const updateProduct = async (productToUpdate: Product) => {
    logInfo(`Got new Product to update with name ${productToUpdate.name}`);
    logTrace(`Product to update: ${JSON.stringify(productToUpdate)}`)
    try {
        await updateProductInDB(productToUpdate);
    } catch (err) {
        logError(`Couldn't update ${productToUpdate.name} product because: ${err}`);
        return new Error(`DB Error`);
    }
    logInfo(`${productToUpdate.name} product updated successfully`);
    return (productToUpdate);
}

const deleteProduct = async (ctx: Koa.Context, productName: string) => {
    logInfo(`Got new request to delete product with name: ${productName}`);
    try {
        await deleteProductFromDB(productName);
    } catch (err) {
        logError(`Couldn't delete ${productName} product from DB because: ${err}`);
        return new Error(`DB Error`);
    }
    logInfo(`${productName} product removed from DB successfully`);
    ctx.noContent();
}

const checkout = async (userId: string) => {
    logInfo(`Start checkout for user: ${userId}`)

    let productsInStore: Product[];
    const errMessage = `Error occurred while executing checkout action`;
    try {
        productsInStore = await getProductsFromDB();
    } catch (err) {
        logError(`${errMessage} for user: ${userId}, ${err}`);
        return new Error('DB Error');
    }

    const userCart = getUserCart(userId);
    const result = await updateProductsAfterCheckout(productsInStore, userCart);

    if (result instanceof Error) {
        logError(`${errMessage} for user: ${userId}, ${result}`);
    } else {
        deleteUserCart(userId);
        logInfo(`Checkout for user: ${userId} executed successfully`)
    }
    return result;
}

const updateProductsAfterCheckout = async (products: Product[],
                                           userCart: Cart): Promise<Product[] | Error> => {
    const items = Object.keys(userCart);
    let error: Error;
    let productsToUpdate: Product[] | Error = items.map((item) => {
        const product = products.find(product => item === product.name)
        if (!!product.limit){
            product.limit -= userCart[item];
            if (product.limit < 0) {
                error = new Error(`The ${product.name} product couldn't be consumed due to exceeding the quantity limit`);
            }
        }
        return product;
    });

    if (!error) {
        productsToUpdate = await updateDBAfterCheckout(productsToUpdate);
        return productsToUpdate;
    } else {
        return error;
    }

}

export const productResolvers = {
    Query: {
        products: getProductsResolver,
        product: async (parent, args) => {
            return await getProductResolver(args.name);
        }
    },
    Mutation: {
        updateProduct: async (parent, args) => {
            return await updateProduct(args.product);
        },
        deleteProduct: async (parent, args, context) => {
            return await deleteProduct(context.ctx, args.name);
        },
        checkout: async (parent, args, context) => {
            return await checkout(context.ctx.headers.authorization);
        }
    }
}