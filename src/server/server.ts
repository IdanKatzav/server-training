import nconf from "nconf";
nconf.file({file:'src/resources/config/ama-romach-config.json'});

import app from "./app";
import {initLogger, logError, logFatal, logInfo} from "../resources/logger/logger";
import {createMongoConnection} from "../resources/mongoDB/db-connection";

const hostname: string = nconf.get('server:host');
const port: number = nconf.get('server:port');

(async () => {
    try {
        initLogger();
        await createMongoConnection(()=> {
            logFatal(`Cannot reconnect mongoDB you have reached to the maximum retries time`);
            nconf.set('isAlive',false);
        });

        app.listen(port, hostname, () => {
            logInfo(`Server running at http://${hostname}:${port}/`);
        });

    } catch (err){
        logError(`Error occurred while initialize ama-romach-server`)
    }
})()

app.on('error', (err) => {
    logError(`${err}`);
});
