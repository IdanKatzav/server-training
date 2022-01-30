import {connect} from 'mongoose';
import {logDebug, logError, logFatal, logInfo} from "../logger/logger";
import {Auth} from "../../models/auth";

const MONGO_DB_NAME = 'ama-romach-db';
const MONGO_AUTH = {
    username: 'idanKatzav',
    password: 'z010170',
}
const MONGO_CONNECTION_OPTIONS = {
    autoIndex: false,
    socketTimeoutMS: 4500,
    maxPoolSize: 30,
}


const createConnectionString = (mongoAuth: Auth, dbName: string): string => {
    return `mongodb+srv://${mongoAuth.username}:${mongoAuth.password}@cluster0.fn40e.mongodb.net/${dbName}?retryWrites=true&w=majority`;
}

export const createMongoConnection = async (previousRetryTime: number = reconnectionOptions.initialRetryTime,
                                            retryCount: number = 0) => {
    const connectionString = createConnectionString(MONGO_AUTH, MONGO_DB_NAME);
    try {
        logDebug(`Trying to connect mongoDB with the connection string: ${connectionString}`);
        await connect(connectionString, MONGO_CONNECTION_OPTIONS);
        logInfo(`DB connection initialized succeeded`);
    } catch (err) {
        logError(`Cannot login to mongoDB because ${err}`);
        reconnectMongo(previousRetryTime, retryCount);
    }
}

const reconnectionOptions = {
    retries: 10,
    initialRetryTime: 300,
    maxRetryTime: 30000,
    multiplier: 2,
    factor: 0.2,
}

const reconnectMongo = (previousRetryTime: number, retryCount: number = 0) => {
    if (retryCount === reconnectionOptions.retries) {
        logFatal(`Cannot reconnect mongoDB you have reached to the maximum retries time`);
    } else {
        retryCount++;
        console.log(retryCount)
        const maxRange = previousRetryTime * (1 + reconnectionOptions.factor);
        const minRange = previousRetryTime * (1 - reconnectionOptions.factor);
        let newRetryTime = Math.floor(Math.random() * (maxRange - minRange + 1) + minRange)
            * reconnectionOptions.multiplier;

        newRetryTime = newRetryTime > reconnectionOptions.maxRetryTime? reconnectionOptions.maxRetryTime : newRetryTime;
        setTimeout(async () => {
            await createMongoConnection(newRetryTime, retryCount);
        }, newRetryTime);
    }
}
