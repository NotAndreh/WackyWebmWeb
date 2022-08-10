import type { FrameBounds, FrameInfo, Mode, ModeOptions } from "./base"
import { delta } from "../util"

export class Bounce implements Mode {
    name = "Bounce"
    options: ModeOptions = {
        startFrame: {
            name: "Start Frame",
            type: "number",
            value: 0
        }
    }

    async setup() { }

    getFrameBounds(info: FrameInfo): FrameBounds {
        let startFrame = this.options.startFrame.value as number
        
        let height = info.maxHeight

        if (info.frame > startFrame) {
            height = info.frame === 0 ? info.maxHeight : Math.floor(Math.abs(Math.cos(((info.frame-startFrame) / (info.frameRate / info.tempo)) * Math.PI) * (info.maxHeight - delta))) + delta
        }
        
        return { height }
    }
}
