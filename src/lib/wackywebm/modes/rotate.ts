import { delta } from "../util"
import type { FrameBounds, FrameInfo, Mode, ModeOptions } from "./base"

export class Rotate implements Mode {
    name = "Rotate"
    options: ModeOptions = { }

    orgHeight: number
    orgWidth: number
    rotateAngle: number

    async setup(info: FrameInfo) {
        this.orgHeight = info.maxHeight
        this.orgWidth = info.maxWidth
        this.rotateAngle = 0
    }

    getFrameBounds(info: FrameInfo): FrameBounds {
        if (info.frame === 0) {
            const maxSize = Math.floor(info.maxWidth * Math.abs(Math.cos(Math.PI / 4)) + info.maxHeight * Math.abs(Math.sin(Math.PI / 4))) + delta
            return {
                width: maxSize,
                height: maxSize,
            }
        }

        this.rotateAngle += info.angle / info.frameRate * info.tempo
        const angle = this.rotateAngle * (Math.PI / 180)
        const width = Math.floor(Math.max(this.orgWidth, this.orgWidth * Math.abs(Math.cos(angle)) + this.orgHeight * Math.abs(Math.sin(angle)))) + delta
        const height = Math.floor(Math.max(this.orgHeight, this.orgWidth * Math.abs(Math.sin(angle)) + this.orgHeight * Math.abs(Math.cos(angle)))) + delta

        return {
            width: width,
            height: height,
            command: ["-vf", `pad=${width}:${height}:(ow-iw)/2:(oh-ih)/2,setsar=1,rotate=${angle}:bilinear=0`],
        }
    }
}
