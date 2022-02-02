import winston from 'winston'
import { format, transports, colors, levels } from "./logger-properties";
import nconf from "nconf";

const logLevel = nconf.get('logger:logLevel');

let Logger: winston.Logger;

winston.addColors(colors);

export const initLogger = () => {
    Logger = winston.createLogger({
        level: logLevel,
        levels,
        format,
        transports,
    });
}

export const logInfo = (message: string): any => {
    Logger.log('info', message);
}

export const logError = (message: string): any => {
    Logger.log('error', message);
}

export const logWarning = (message: string): any => {
    Logger.log('warning', message);
}

export const logDebug = (message: string): any => {
    Logger.log('debug', message);
}

export const logTrace = (message: string): any => {
    Logger.log('trace', message);
}

export const logFatal = (message: string): any => {
    Logger.log('fatal', message);
}
