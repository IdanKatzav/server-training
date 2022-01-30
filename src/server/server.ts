import app from "./app";
import {initLogger, logError, logInfo} from "../resources/logger/logger";
import {createMongoConnection} from "../resources/mongoDB/db-connection";


const hostname = '127.0.0.1';
const port = 4321;

(async () => {
    try {
        initLogger();
        await createMongoConnection();

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
