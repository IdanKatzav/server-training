import {CartUpdate} from "../../models/cart-update";
import {changeOccupiedItem, deleteUserCart, getAll, getUserCart} from "../../resources/cache/released-cache";
import {logDebug, logInfo, logWarning} from "../../resources/logger/logger";
import {PubSub} from "graphql-subscriptions";
import Koa from "koa";

const pubsub = new PubSub();

const updateCart = async (ctx: Koa.Context, cartUpdate: CartUpdate) => {
    const userId = ctx.headers.authorization;
    const previousAmount = getUserCart(userId)[cartUpdate.productName] || 0;
    logInfo(`Updating product ${cartUpdate.productName} cart user: ${userId}`);

    const updatedAmount = cartUpdate.action === "RELEASE" ? previousAmount - (cartUpdate.amount) : previousAmount + (cartUpdate.amount);
    if (updatedAmount < 0) {
        logWarning(`Customer ${userId} can not have a negative balance in the cart`);
        ctx.badRequest();
        return new Error('Cart balance cannot be negative');
    } else {
        changeOccupiedItem(userId, cartUpdate.productName, updatedAmount);

        await pubsub.publish('CART_UPDATED', {updateCart: cartUpdate});
        logInfo(`The quantity of the ${cartUpdate.productName} product has been updated to ${updatedAmount} in user's cart, user: ${userId}`)
        return cartUpdate;
    }
}


export const cartResolvers = {
    Mutation: {
        updateCart: async (parent, args, context) => {
            return await updateCart(context.ctx, args.cartUpdate);
        }
    },
    Subscription: {
        updateCart: {
            subscribe: () => pubsub.asyncIterator(['CART_UPDATED'])
        }
    }
}

export const deleteCart = async (userId: string) => {
    logDebug(`Start deleting ${userId} cart`);
    const userCart = getUserCart(userId);

    if (userCart === undefined) {
        return new Error('Unauthorized');
    }
    const cartUpdatePromises: Promise<void>[] = Object.keys(userCart).map((item) =>
        pubsub.publish('CART_UPDATED', {
            updateCart: {
                productName: item,
                action: 'RELEASE',
                amount: userCart[item]
            }
        })
    );

    await Promise.all(cartUpdatePromises);
    deleteUserCart(userId);
    logDebug(`User: ${userId} cart was deleted successfully`);
}