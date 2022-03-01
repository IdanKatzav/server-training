import Koa from 'koa';
import {identificationMiddleware, loggerMiddleware} from "./middleware-functions";
import http from "http";
import {ApolloServer} from "apollo-server-koa";
import {
    ApolloServerPluginDrainHttpServer,
    ApolloServerPluginLandingPageGraphQLPlayground,
    ValidationError
} from "apollo-server-core";
import {logError, logInfo} from "../resources/logger/logger";
import {generalSchema} from "../resources/graphQL/graphql-schemas";
import {execute, GraphQLError, subscribe} from "graphql";
import {SubscriptionServer} from "subscriptions-transport-ws";
import bodyParser from "koa-bodyparser";
import {addUser, getUserCart} from "../resources/cache/released-cache";
import {deleteCart} from "../bl/resolvers/cart-resolvers";
import {ApolloError} from "apollo-server";

const respond = require('koa-respond');


export const initApolloServer = async (): Promise<http.Server> => {
    const apolloHttpServer = http.createServer();
    const subscriptionServer = SubscriptionServer.create({
            schema: generalSchema,
            subscribe,
            execute,
            onConnect:(connectionParams) =>{
                const userId: string = connectionParams.authorization;
                if (!getUserCart(userId)) {
                    addUser(userId);
                }

                logInfo(`New subscription initialized for user: ${userId}`);
                return {userId}
            },
            onDisconnect: async (webSocket, context) =>{
                const {userId} = await context.initPromise;
                logInfo(`User: ${userId} subscription finished`);
                await deleteCart(userId);
            }
        },
        {server: apolloHttpServer, path: '/graphql'});

    const apolloServer = new ApolloServer({
        schema: generalSchema,
        context: ({ctx}) => ({ctx}),
        plugins: [
            ApolloServerPluginDrainHttpServer({httpServer: apolloHttpServer}),
            ApolloServerPluginLandingPageGraphQLPlayground(),
            endSubscriptionPlugin(subscriptionServer)],
        formatError: graphqlErrorFormatter
    });
    await apolloServer.start();

    const app = new Koa();
    app.keys = ['idan katzav'];

    addMiddlewares(app);
    apolloServer.applyMiddleware({app});
    apolloHttpServer.on('request', app.callback());
    apolloHttpServer.on('error', (err) => {
        logError(`${err}`)
    });

    return apolloHttpServer;
}

const addMiddlewares = (app: Koa) => {
    app.use(bodyParser());
    // app.use(session(configSession, app));
    // app.use(sessionMiddleware);
    app.use(identificationMiddleware);
    app.use(loggerMiddleware);
    app.use(respond());
}

const graphqlErrorFormatter = (err: GraphQLError) => {
    if (err.extensions.code === 'GRAPHQL_VALIDATION_FAILED') {
        return new ValidationError(err.message);
    } else if (err.message.startsWith('DB Error')) {
        return new ApolloError('Internal Server Error');
    } else {
        return new ApolloError(`${err}`);
    }
}

const endSubscriptionPlugin = (subscriptionServer: SubscriptionServer) => ({
    async serverWillStart() {
        return {
            async drainServer() {
                subscriptionServer.close();
            }
        };
    }
});
