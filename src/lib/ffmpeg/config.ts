export const defaultArgs = [
    './ffmpeg',
    '-nostdin',
    '-y'
]

export const baseOptions = {
    log: false,
    logger: () => {},
    progress: () => {},
    corePath: '',
}
