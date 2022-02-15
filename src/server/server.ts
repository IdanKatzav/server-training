import {setConfig} from "../resources/config/set-config";

setConfig();

import nconf from "nconf";
import {app} from "./app";
import {initLogger, logError, logFatal, logInfo} from "../resources/logger/logger";
import {createMongoConnection} from "../resources/mongoDB/db-connection";

const hostname: string = nconf.get('server:host');
const port: number = nconf.get('server:port');

(async () => {
    initLogger();
    await createMongoConnection(() => {
        logFatal(`Cannot reconnect mongoDB you have reached to the maximum retries time`);
        nconf.set('isAlive', false);
    });

    app.listen(port, hostname, () => {
        logInfo(`Server running at http://${hostname}:${port}/`);
    });
})()

app.on('error', (err) => {
    logError(`${err}`);
});