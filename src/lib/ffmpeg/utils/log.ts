export interface ffmpegLog {
    type: string
    message: string
}

export let logging = false;
let customLogger: (log: ffmpegLog) => void = () => {};

export const setLogging = (_logging: boolean) => {
    logging = _logging
}

export const setCustomLogger = (logger: (log: ffmpegLog) => void) => {
    customLogger = logger;
}

export const log = (type: string, message: string) => {
    customLogger({ type, message });
    if (logging) {
        console.log(`[${type}] ${message}`)
    }
}
