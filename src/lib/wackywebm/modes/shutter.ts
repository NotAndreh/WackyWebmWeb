import type { Mode } from "./base";
import { delta } from "../util";

export const Shutter: Mode = {
    name: 'Shutter',
    setup: () => {},
    getFrameBounds: (info) => ({
        width: info.frame === 0 ? info.maxWidth : Math.floor(Math.abs(Math.cos((info.frame / (info.frameRate / info.tempo)) * Math.PI) * (info.maxWidth - delta))) + delta
    })
}