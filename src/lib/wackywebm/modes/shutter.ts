import type { FrameBounds, FrameInfo, Mode, ModeOptions } from "./base";
import { delta } from "../util";

export class Shutter implements Mode {
    name = 'Shutter'
    options: ModeOptions = {
        startFrame: {
            name: 'Start Frame',
            type: 'number',
            value: 0
        }
    }

    setup() { }

    getFrameBounds(info: FrameInfo): FrameBounds {
        let startFrame = this.options.startFrame.value as number

        let width = info.maxWidth

        if (info.frame > startFrame) {
            width = info.frame === 0 ? info.maxWidth : Math.floor(Math.abs(Math.cos(((info.frame-startFrame) / (info.frameRate / info.tempo)) * Math.PI) * (info.maxWidth - delta))) + delta
        }

        return { width }
    }
}