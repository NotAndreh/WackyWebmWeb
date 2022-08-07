export abstract class Mode {
    abstract name: string
    abstract options: ModeOptions

    abstract setup(info: FrameInfo, video: File): void
    abstract getFrameBounds(info: FrameInfo): FrameBounds
}

export interface FrameInfo {
    frame: number
    maxWidth: number
    maxHeight: number
    frameCount: number
    frameRate: number
    tempo: number
    angle: number
}

export interface FrameBounds {
    width?: number
    height?: number
    command?: string[]
}

export interface ModeOptions {
    [key: string]: ModeOption
}

export type ModeOption = {
    name: string
    type: 'string'
    value: string
} | {
    name: string
    type: 'number'
    value: number
} | {
    name: string
    type: 'boolean'
    value: boolean
} | {
    name: string
    type: 'textarea'
    value: string
}
