import type { Mode } from "./base";
import { delta } from "../util";

export const Bounce: Mode = {
    name: "Bounce",
    setup: () => {},
    getFrameBounds: (info) => ({
        height: info.frame === 0 ? info.maxHeight : Math.floor(Math.abs(Math.cos((info.frame / (info.frameRate / info.tempo)) * Math.PI) * (info.maxHeight - delta))) + delta
    })
}