import winston from 'winston'
import {logLevels} from "./log-levels";

const LOG_LEVEL = 'info';

const colors = {
    fatal: 'bold red yellowBG',
    error: 'bold red',
    warning: 'bold yellow',
    info: 'bold green',
    debug: 'bold cyan',
    trace: 'bold magenta',
}

const transports = [
    new winston.transports.Console(),
    new winston.transports.File({
        filename: 'logs/error.log',
        level: 'error',
    }),
    new winston.transports.File({ filename: 'logs/all.log' }),
]

const format = winston.format.combine(
    winston.format.timestamp({format: 'YYYY-MM-DD HH:mm:ss:ms'}),
    winston.format.colorize({level: true}),
    winston.format.printf(
    (info) => `${info.timestamp} ${info.level}: ${info.message}`,
    )
);

const Logger = winston.createLogger({
    level: LOG_LEVEL,
    levels: logLevels,
    format,
    transports,
});

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
