import { env } from '../config';

export class Logger {
    private static isDev: boolean = (env.NODE_ENV || 'development') === 'development';

    static info(context: string, message: string) {
        console.log(`${this.formatPrefix('INFO', context)} ${message}`);
    }

    static warn(context: string, message: string) {
        console.warn(`${this.formatPrefix('WARN', context)} ${message}`);
    }

    static error(context: string, message: string | Error, error?: unknown) {
        if (message instanceof Error) {
            console.error(`${this.formatPrefix('ERROR', context)} ${message.message}\n${message.stack}`);
            return;
        }
        if (error instanceof Error) {
            console.error(`${this.formatPrefix('ERROR', context)} ${message}\n${error.stack}`);
        } else {
            console.error(`${this.formatPrefix('ERROR', context)} ${String(message)}`);
        }
    }

    static debug(context: string, message: string) {
        if (!this.isDev) return;
        console.debug(`${this.formatPrefix('DEBUG', context)} ${message}`);
    }

    private static formatPrefix(level: string, context?: string) {
        const time = new Date().toISOString()
        return `[${level}]${context ? ' [' + context + ']' : ''} ${time} -`
    }
}

export default Logger
