import type { FrameBounds, FrameInfo, Mode, ModeOptions } from "./base"

export class Shrink implements Mode {
    name = "Shrink"
    options: ModeOptions = {
        startFrame: {
            name: "Start Frame",
            type: "number",
            value: 0
        },
        endFrame: {
            name: "End Frame",
            type: "number",
            value: 0
        }
    }

    async setup() { }

    getFrameBounds(info: FrameInfo): FrameBounds {
        let startFrame = this.options.startFrame.value as number
        let endFrame = this.options.endFrame.value as number

        endFrame = endFrame === 0 ? info.frameCount : endFrame
        
        let height = info.maxHeight

        if (info.frame > startFrame) {
            height = Math.max(1, Math.floor(info.maxHeight - ((info.frame-startFrame) / (endFrame-startFrame)) * info.maxHeight))
        }

        return { height }
    }
}
