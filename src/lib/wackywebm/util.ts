import { createFFmpeg, fetchFile } from "../ffmpeg"

// These could be arguments, as well. They could also be taken via user input with readline.
export const delta = 1

// In case audio level readouts throw an "-inf"
// this will make it Javascript's negative infinity.
// dont export this (yet), we dont need it anywhere except getAudioLevelMap currently
const resolveNumber = (n: any, d = Number.NEGATIVE_INFINITY) => isFinite(n) ? Number(n) : d

// Obtains a map of the audio levels in decibels from the input file.
export async function getAudioLevelMap(file: File) {
	let ffmpeg = createFFmpeg()
	await ffmpeg.load()

	ffmpeg.FS("writeFile", "video.mp4", await fetchFile(file))

	await ffmpeg.run(
		"-i", "video.mp4", 
		"-af", "astats=metadata=1:reset=1,ametadata=print:key=lavfi.astats.Overall.RMS_level:file=map.txt", 
		"-f", "null", "-"
	)

	let data = ffmpeg.FS("readFile", "map.txt")
	if (!data) return
	let map = new TextDecoder().decode(data)

	// Clean up
	ffmpeg.FS("unlink", "video.mp4")
	ffmpeg.FS("unlink", "map.txt")
	ffmpeg.exit()

	// Remap to simplify the format.
	let intermediateMap: { frame: number, dBs: number, percentMax: number }[] = []
	let matches = map.matchAll(/(?:.+\n?){2}/g)
	for (let match of matches) {
		let frame = Number(match[0].match(/frame:(\d+)/)[1]) + 1
		let dBs = Number(match[0].match(/lavfi\.astats\.Overall\.RMS_level=(.*)/)[1])
		intermediateMap.push({ frame, dBs, percentMax: 0 })
	}

	const highest = intermediateMap.reduce((previous, current) => (previous.dBs > current.dBs ? previous : current))

	// Obtain the average audio level of the file.
	const average = intermediateMap.reduce((previous, current) => previous + resolveNumber(current.dBs, 0), 0) / intermediateMap.length
	
	// Calculate the deviation.
	const deviation = Math.abs((highest.dBs - average) / 2)
	
	// Calculate and amend percentage of decimals from across the video.
	for (const frame of intermediateMap) {
		const clamped = Math.max(Math.min(frame.dBs, average + deviation), average - deviation)
		const v = Math.abs((clamped - average) / deviation) * 0.5
		frame.percentMax = clamped > average ? (0.5 + v) : (0.5 - v)
	}

	return intermediateMap
}