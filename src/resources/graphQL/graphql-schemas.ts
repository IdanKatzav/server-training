import {makeExecutableSchema} from "@graphql-tools/schema";
import {stitchSchemas} from '@graphql-tools/stitch';

import {productTypeDefs} from "./type-defs/product-type-defs";
import {productResolvers} from "../../bl/resolvers/product-resolvers";
import {cartTypeDefs} from "./type-defs/cart-type-defs";
import {cartResolvers} from "../../bl/resolvers/cart-resolvers";
import {mergeResolvers, mergeTypeDefs} from "@graphql-tools/merge";


// export const productSubSchema = {
//     schema: makeExecutableSchema({
//         typeDefs: productTypeDefs,
//         resolvers: productResolvers
//     })
// };
//
// export const cartSubSchema = {
//     schema: makeExecutableSchema(
//         {
//             typeDefs: cartTypeDefs,
//             resolvers: cartResolvers
//         })
// };


export const generalResolvers = mergeResolvers([cartResolvers, productResolvers]);
export const generalTypedefs = mergeTypeDefs([cartTypeDefs, productTypeDefs]);

export const generalSchema = makeExecutableSchema({
    resolvers: generalResolvers,
    typeDefs: generalTypedefs
});
