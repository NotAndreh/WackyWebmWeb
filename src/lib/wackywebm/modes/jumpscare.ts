import type { Mode } from "./base";

// TODO OPTIONS

export const Jumpscare: Mode = {
    name: "Jumpscape",
    setup: () => {},
    getFrameBounds: (info) => {
        // shrink to minimumSize time (in sec)
        const minimumSizeTime = 1
        // jump to full size time (in sec)
        const fullSizeTime = 4
        // minimum width and height
        const minimumSize = 10

        const minimumSizeFrame = minimumSizeTime * info.frameRate
        const fullSizeFrame = fullSizeTime * info.frameRate

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
    },
}