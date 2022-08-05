import type { Mode } from "./base";
import { delta } from "../util";

export const Sporadic: Mode = {
    name: "Sporadic",
    setup: () => {},
    getFrameBounds: (info) => ({
        width: info.frame === 0 ? info.maxWidth : Math.floor(Math.random() * (info.maxWidth - delta)) + delta,
        height: info.frame === 0 ? info.maxHeight : Math.floor(Math.random() * (info.maxHeight - delta)) + delta
    })
}