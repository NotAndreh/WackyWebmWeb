import type { FrameBounds, FrameInfo, Mode, ModeOptions } from "./base"
import { delta } from "../util"

export class Sporadic implements Mode {
    name = "Sporadic"
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
        let width = info.maxWidth

        if (info.frame > startFrame) {
            width = info.frame === 0 ? info.maxWidth : Math.floor(Math.random() * (info.maxWidth - delta)) + delta,
            height = info.frame === 0 ? info.maxHeight : Math.floor(Math.random() * (info.maxHeight - delta)) + delta
        }

        return { width, height }
    }
}
