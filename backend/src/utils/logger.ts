import { env } from '../config';

export class Logger {
    private static isDev: boolean = (env.NODE_ENV || 'development') === 'development';

    // Info-level logs should always be emitted in production too
    static info(context: string, message: string) {
        console.log(`${this.formatPrefix('INFO', context)} ${message}`);
    }

    // Warnings should also be visible in production
    static warn(context: string, message: string) {
        console.warn(`${this.formatPrefix('WARN', context)} ${message}`);
    }

    // Errors should always be visible; accept either a message or an Error
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

    // Debug remains gated to development only
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
