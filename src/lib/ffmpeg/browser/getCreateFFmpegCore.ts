import { log } from '../utils/log'
import { CREATE_FFMPEG_CORE_IS_NOT_DEFINED } from '../utils/errors'

/*
 * Fetch data from remote URL and convert to blob URL
 * to avoid CORS issue
 */
const toBlobURL = async (url: string, mimeType: string) => {
    log('info', `fetch ${url}`)
    const buf = await (await fetch(url)).arrayBuffer()
    log('info', `${url} file size = ${buf.byteLength} bytes`)
    const blob = new Blob([buf], { type: mimeType })
    const blobURL = URL.createObjectURL(blob)
    log('info', `${url} blob URL = ${blobURL}`)
    return blobURL
}

export default async function({ corePath: _corePath }): Promise<any> {
    if (typeof _corePath !== 'string') {
        throw Error('corePath should be a string!');
    }
    const coreRemotePath = new URL(_corePath).href;
    const corePath = await toBlobURL(
        coreRemotePath,
        'application/javascript',
    );
    const wasmPath = await toBlobURL(
        coreRemotePath.replace('ffmpeg-core.js', 'ffmpeg-core.wasm'),
        'application/wasm',
    );
    const workerPath = await toBlobURL(
        coreRemotePath.replace('ffmpeg-core.js', 'ffmpeg-core.worker.js'),
        'application/javascript',
    );
    // @ts-expect-error
    if (typeof createFFmpegCore === 'undefined') {
        return new Promise((resolve) => {
            const script = document.createElement('script')
            const eventHandler = () => {
                script.removeEventListener('load', eventHandler)
                // @ts-expect-error
                if (typeof createFFmpegCore === 'undefined') {
                    throw Error(CREATE_FFMPEG_CORE_IS_NOT_DEFINED(coreRemotePath))
                }
                log('info', 'ffmpeg-core.js script loaded')
                resolve({
                    // @ts-expect-error
                    createFFmpegCore,
                    corePath,
                    wasmPath,
                    workerPath,
                })
            }
            script.src = corePath
            script.type = 'text/javascript'
            script.addEventListener('load', eventHandler)
            document.getElementsByTagName('head')[0].appendChild(script)
        });
    }
    log('info', 'ffmpeg-core.js script is loaded already')
    return Promise.resolve({
        // @ts-expect-error
        createFFmpegCore,
        corePath,
        wasmPath,
        workerPath,
    })
}
