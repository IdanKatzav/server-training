import nconf from "nconf";
import {connect} from 'mongoose';
import {logDebug, logError, logInfo} from "../logger/logger";
import {Auth} from "../../models/auth";

const mongoDbName = nconf.get('mongoDB:db');
const mongoAuth = nconf.get('mongoDB:auth');
const mongoCluster = nconf.get('mongoDB:cluster');
const mongoConnectionOptions = nconf.get('mongoDB:mongoConnectionOptions');
const reconnectionOptions = nconf.get('mongoDB:reconnectionOptions');


const createConnectionString = (mongoAuth: Auth, cluster: string, dbName: string): string => {
    return `mongodb+srv://${mongoAuth.username}:${mongoAuth.password}@${cluster}/${dbName}?retryWrites=true&w=majority`;
}

export const createMongoConnection = async (callbackOnTotalFailure: () => void,
                                            previousRetryTime: number = reconnectionOptions.initialRetryTime,
                                            retryCount: number = 0) => {
    const connectionString = createConnectionString(mongoAuth, mongoCluster, mongoDbName);
    try {
        logDebug(`Trying to connect mongoDB with the connection string: ${connectionString}`);
        await connect(connectionString, mongoConnectionOptions);
        logInfo(`DB connection initialized succeeded`);
    } catch (err) {
        logError(`Cannot login to mongoDB because ${err}`);
        reconnectMongo(previousRetryTime, retryCount, callbackOnTotalFailure);
    }
}


const reconnectMongo = (previousRetryTime: number, retryCount: number = 0, callbackOnTotalFailure: () => void) => {
    if (retryCount === reconnectionOptions.retries) {
        callbackOnTotalFailure();
    } else {
        retryCount++;
        const maxRange = previousRetryTime * (1 + reconnectionOptions.factor);
        const minRange = previousRetryTime * (1 - reconnectionOptions.factor);
        let newRetryTime = Math.floor(Math.random() * (maxRange - minRange + 1) + minRange)
            * reconnectionOptions.multiplier;

        newRetryTime = newRetryTime > reconnectionOptions.maxRetryTime ? reconnectionOptions.maxRetryTime : newRetryTime;
        setTimeout(async () => {
            await createMongoConnection(callbackOnTotalFailure, newRetryTime, retryCount);
        }, newRetryTime);
    }
}