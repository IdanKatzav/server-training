import {CartUpdate} from "../../models/cart-update";
import {changeOccupiedItem, getUserCart} from "../../resources/cache/released-cache";

const updateCart = async (userId: string, cartUpdate: CartUpdate) => {
    const previousAmount = getUserCart(userId)[cartUpdate.name];
    const updatedAmount = cartUpdate.action === "RELEASED"? previousAmount -(cartUpdate.amount): previousAmount +(cartUpdate.amount);
    changeOccupiedItem(userId, cartUpdate.name, updatedAmount);
    //TODO: add pubsub
}


export const cartResolvers = {
    Mutation: {
        updateCart: async (parent, args, context, info) => {
            return await updateCart(context.userSession.userId, args.cartUpdate);
        }
    }
}