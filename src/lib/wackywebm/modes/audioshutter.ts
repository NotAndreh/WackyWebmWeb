import { delta, getAudioLevelMap } from "../util"
import type { FrameBounds, FrameInfo, Mode, ModeOptions } from "./base"

export class AudioShutter implements Mode {
    name = "Audio Shutter"
    options: ModeOptions = { }

    audioMap = []
    audioMapL = 0

    async setup(_: FrameInfo, video: File) {
        this.audioMap = await getAudioLevelMap(video)
        this.audioMapL = this.audioMap.length - 1
    }

    getFrameBounds(info: FrameInfo): FrameBounds {
        const { percentMax } = this.audioMap[Math.max(Math.min(Math.floor((info.frame / (info.frameCount - 1)) * this.audioMapL), this.audioMapL), 0)]
        return {
            width: info.frame === 0 ? info.maxWidth : Math.max(Math.floor(Math.abs(info.maxWidth * percentMax)), delta),
        }
    }
}
