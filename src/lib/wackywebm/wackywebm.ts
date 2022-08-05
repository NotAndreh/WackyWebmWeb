import { createFFmpeg, fetchFile } from "../ffmpeg"
import type { Mode } from "./modes/base"
import type { FFmpeg } from "../ffmpeg/createFFmpeg"

export interface WackyWebmOptions {
    file: File
    mode: Mode,
    scale?: number
    onProgress?: (stage: string, progress: number) => void
}

export async function wackyWebm(options: WackyWebmOptions) {
    const { 
        file,
        mode,
        scale = 4,
        onProgress
    } = options

    // Lazy load FFprobe
    const FFprobeWasm = await import("ffprobe-wasm")

    let stage = "frames"
    let ffprobe = new FFprobeWasm.FFprobeWorker()
    let ffmpeg: FFmpeg

    const info = await ffprobe.getFileInfo(file)
    const width = info.streams[0].codec_width / scale
    const height = info.streams[0].codec_height / scale
    const frameRate = parseInt(info.streams[0].r_frame_rate.split("/")[0]);
    const frameCount = parseInt(info.streams[0].nb_frames)

    let parts = []
    for (let i = 0; i < Math.ceil(frameCount / 50); i++) {
        let fromFrame = i * 50
        let toFrame = Math.min((i + 1) * 50 - 1, frameCount)

        // Setup ffmpeg
        ffmpeg = createFFmpeg({ log: true })
        await ffmpeg.load()
        ffmpeg.setProgress(x => {
            if (stage != "webm") {
                onProgress(stage, x.ratio)
            }
        })
        ffmpeg.FS("writeFile", "video.mp4", await fetchFile(file))

        stage = "frames"
        await ffmpeg.run(
            "-i", "video.mp4",
            "-vf", `scale=${width}:${height}, select=between(n\\,${fromFrame}\\,${toFrame})`,
            "%d.png"
        )

        stage = "webm"
        const list = [];

        let currentFrame = 0;
        let lastWidth = -1;
        let lastHeight = -1;
        let sameSizeCount = 1;
        const compressionLevel = 0;

        for (let i = fromFrame; i <= toFrame; i++) {
            onProgress(stage, i / frameCount)
    
            const infoObject = {
                frame: i,
                maxWidth: width,
                maxHeight: height,
                frameCount: frameCount,
                frameRate: frameRate,
                tempo: 1, // TODO
                angle: 360, //TODO
            };
    
            const frameBounds: any = {};
            const current: any = mode.getFrameBounds(infoObject);
    
            if (current.width !== undefined) frameBounds.width = current.width;
            if (current.height !== undefined) frameBounds.height = current.height;
            if (current.command !== undefined) frameBounds.command = current.command;
      
            if (frameBounds.width === undefined) frameBounds.width = width;
            if (frameBounds.height === undefined) frameBounds.height = height;
      
            if (i === 0) {
                lastWidth = frameBounds.width;
                lastHeight = frameBounds.height;
            }
    
            if (Math.abs(frameBounds.width - lastWidth) + 
                Math.abs(frameBounds.height - lastHeight) > compressionLevel ||
                i === toFrame
            ) {
                // Convert to webm
                await ffmpeg.run(
                  "-r", frameRate.toString(),
                  "-start_number", (i - sameSizeCount + 1).toString(),
                  "-i", "%d.png",
                  "-frames:v", sameSizeCount.toString(),
                  "-c:v", "vp8",
                  "-b:v", "1M",
                  "-crf", "10",
                  "-vf", `scale=${frameBounds.width}x${frameBounds.height}`,
                  "-aspect", `${frameBounds.width}:${frameBounds.height}`,
                  "-f", "webm",
                  `${i}.webm`
                )
        
                list.push(`file ${i}.webm`)
        
                sameSizeCount = 1
                lastWidth = frameBounds.width
                lastHeight = frameBounds.height
            } else {
                sameSizeCount++
            }
        }

        stage = "concat"
        const listEncoded = new TextEncoder().encode(list.join("\n"))
        ffmpeg.FS("writeFile", "list.txt", listEncoded)

        // Create final webm file
        await ffmpeg.run(
            "-f", "concat",
            "-safe", "0",
            "-i", "list.txt",
            "-c", "copy",
            `part${i}.webm`
        )

        parts.push(ffmpeg.FS("readFile", `part${i}.webm`))

        Promise.all([
            ffmpeg.FS("unlink", "list.txt"),
            ffmpeg.FS("unlink", "video.mp4"),
            ...new Array(toFrame - fromFrame)
                .fill(0)
                .map((_, i) => {
                    ffmpeg.FS("unlink", `${fromFrame + i + 1}.png`)
                }),
            list.map((string) => ffmpeg.FS("unlink", string.split(" ")[1])),
        ])

        ffmpeg.exit()
    }

    ffmpeg = createFFmpeg({ log: true })
    await ffmpeg.load()

    let list = []
    ffmpeg.FS("writeFile", "video.mp4", await fetchFile(file))
    parts.forEach((part, i) => {
        ffmpeg.FS("writeFile", `part${i}.webm`, part)
        list.push(`file part${i}.webm`)
    })

    // Extract audio
    stage = "audio"
    await ffmpeg.run(
        "-i", "video.mp4",
        "-vn",
        "-c:a", "libvorbis",
        "audio.webm"
    )
    
    // Create file list for ffmpeg
    stage = "final"
    const listEncoded = new TextEncoder().encode(list.join("\n"))
    ffmpeg.FS("writeFile", "list.txt", listEncoded)

    // Create final webm file
    await ffmpeg.run(
        "-f", "concat",
        "-safe", "0",
        "-i", "list.txt",
        "-i", "audio.webm",
        "-c", "copy",
        "final.webm"
    )

    stage = "finished"
    const data = ffmpeg.FS("readFile", "final.webm")
    
    Promise.all([
        ffmpeg.FS("unlink", "list.txt"),
        ffmpeg.FS("unlink", "audio.webm"),
        ffmpeg.FS("unlink", "video.mp4"),
        list.map((string) => ffmpeg.FS("unlink", string.split(" ")[1])),
    ])

    ffmpeg.exit()
    ffprobe.terminate()

    if (data) {
        return URL.createObjectURL(
            new Blob([data.buffer], { type: "video/webm" })
        )
    }
}