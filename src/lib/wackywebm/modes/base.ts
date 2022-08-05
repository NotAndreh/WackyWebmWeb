export interface Mode {
    name: string
    setup: () => void
    getFrameBounds: (info: FrameInfo) => { width?: number, height?: number, command?: string }
}

export interface FrameInfo {
    frame: number;
    maxWidth: number;
    maxHeight: number;
    frameCount: number;
    frameRate: number;
    tempo: number;
    angle: number;
} 