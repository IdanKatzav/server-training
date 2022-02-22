import {setConfig} from "../../config/set-config";
setConfig();

import nconf from "nconf";
import {initApolloServer} from "./app";
import {initLogger, logFatal, logInfo} from "../resources/logger/logger";
import {createMongoConnection} from "../resources/mongoDB/db-connection";
import {initCache} from "../resources/cache/released-cache";


const hostname: string = nconf.get('server:host');
const port: number = nconf.get('server:port');


(async () => {
    initLogger();
    initCache();
    await createMongoConnection(() => {
        logFatal(`Cannot reconnect mongoDB you have reached to the maximum retries time`);
        nconf.set('isAlive', false);
    });

    const apolloHttpServer = await initApolloServer();
    apolloHttpServer.listen(port, hostname, () => {
        logInfo(`Graphql server running at http://${hostname}:${port}/graphql`);
    });
})()

