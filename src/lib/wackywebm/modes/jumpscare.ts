import type { FrameBounds, FrameInfo, Mode, ModeOptions } from "./base"

export class Jumpscare implements Mode {
    name = "Jumpscape"
    options: ModeOptions = {
        minimumSizeFrame: {
            name: "Minimum size frame",
            type: "number",
            value: 30
        },
        fullSizeFrame: {
            name: "Full size frame",
            type: "number",
            value: 120
        },
        minimumSize: {
            name: "Minimum size",
            type: "number",
            value: 5
        }
    }

    setup() { }

    getFrameBounds(info: FrameInfo): FrameBounds {
        let minimumSizeFrame = this.options.minimumSizeFrame.value as number
        let fullSizeFrame = this.options.fullSizeFrame.value as number
        let minimumSize = this.options.minimumSize.value as number

        let width: number 
        let height: number
        if (info.frame < minimumSizeFrame) {
            width = Math.max(minimumSize, Math.floor(info.maxWidth - info.frame / minimumSizeFrame * (info.maxWidth - minimumSize)))
            height = Math.max(minimumSize, Math.floor(info.maxHeight - info.frame / minimumSizeFrame * (info.maxHeight - minimumSize)))
        } else
            width = height = minimumSize

        if (info.frame > fullSizeFrame) {
            height = info.maxHeight
            width = info.maxWidth
        }
        return { width, height }
    }
}
