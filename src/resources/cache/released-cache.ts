import {Cart} from "../../models/cart";
import {ReleasedCache} from "../../models/released-cache";

let releasedCache: ReleasedCache = {};

export const initCache = () => {
    releasedCache = {};
}

export const getOccupiedItems = (productName: string): number => {
    const users = Object.keys(releasedCache);
    let occupiedItems = 0;
    users.forEach((user) => {
        occupiedItems += releasedCache[user][productName] || 0
    });

    return occupiedItems;
};

export const getUserCart = (user: string): Cart => {
    return releasedCache[user];
}

export const getUserItemAmount = (user: string, productName: string): Cart => {
    return releasedCache[user];
}

export const deleteUserCart = (user: string) => {
    delete releasedCache[user];
}

export const deleteUserItem = (user: string, productName: string) => {
    delete releasedCache[user][productName];
}

export const changeOccupiedItem = (user: string, productName: string, amount: number) => {
    releasedCache[user][productName] = amount;
}

export const getAll = (): ReleasedCache => {
    return releasedCache;
}

export const addUser = (user: string) => {
    releasedCache[user] = {};
}

