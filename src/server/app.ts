import Koa from 'koa';
import {loggerMiddleware, sessionMiddleware} from "./middleware-functions";
import nconf from "nconf";
import session from "koa-session";
import http from "http";
import {ApolloServer} from "apollo-server-koa";
import {productTypeDefs} from "../resources/graphQL/type-defs/product-type-defs";
import {productResolvers} from "../bl/resolvers/product-resolvers";
import {ApolloServerPluginDrainHttpServer, ApolloServerPluginLandingPageGraphQLPlayground} from "apollo-server-core";
import {GetMiddlewareOptions} from "apollo-server-koa/dist/ApolloServer";
import {logError} from "../resources/logger/logger";

const respond = require('koa-respond');


const allowedList = nconf.get('server:allowedList');
const configSession = nconf.get('session');

const rest: GetMiddlewareOptions = {
    cors: { origin: allowedList},
}

export const initApolloServer = async (): Promise<http.Server> => {
    const apolloHttpServer = http.createServer();
    const apolloServer = new ApolloServer({
        typeDefs: productTypeDefs,
        resolvers: productResolvers,
        context: ({ctx}) => ({userSession: ctx.session}),
        plugins: [ApolloServerPluginDrainHttpServer({ httpServer: apolloHttpServer }),
            ApolloServerPluginLandingPageGraphQLPlayground()],
    });
    await apolloServer.start();

    const app = new Koa();
    app.keys = ['idan katzav'];

    addMiddlewares(app);
    apolloServer.applyMiddleware({app,...rest});
    apolloHttpServer.on('request', app.callback());
    apolloHttpServer.on('error', (err) => { logError(`${err}`) });

    return apolloHttpServer;
}

const addMiddlewares = (app: Koa) => {
    app.use(session(configSession,app));
    app.use(sessionMiddleware);
    app.use(loggerMiddleware);
    app.use(respond());
}

