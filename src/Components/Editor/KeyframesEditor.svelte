<script lang="ts">
    import { faBookmark, faPause, faPlay, faXmark } from "@fortawesome/free-solid-svg-icons"
    import { ease, linear } from "../../lib/wackywebm/interpolation";
    import type { Keyframe } from "./types";
    import PropertyEditor from "./PropertyEditor.svelte"
    import ResizeBox from "./ResizeBox.svelte"
    import Fa from "svelte-fa"

    export let preview: string
    export let keyframesString: any
    let video: HTMLVideoElement
    let paused = true
    let duration: number
    let clientWidth: number
    let clientHeight: number
    let currentTime: number = 0
    let keyframe: Keyframe | null
    let leftKf: Keyframe | null
    let rightKf: Keyframe | null

    let resBoxWidth: number
    let resBoxHeight: number

    $: formattedTime = formatTime(currentTime)
    $: formattedDuration = formatTime(duration)
    $: {
        if (keyframes.length && video) {
            leftKf = keyframes[0]
            rightKf = keyframes[keyframes.length - 1]
            for (let i = 0; i < keyframes.length; i++) {
                if (keyframes[i].time > currentTime) {
                    rightKf = keyframes[i]
                    break
                }
                leftKf = keyframes[i]
            }
            if (leftKf.time > currentTime) leftKf = {
                time: 0,
                width: video.videoWidth,
                height: video.videoHeight,
                interpolation: "linear"
            }
            if (rightKf.time < currentTime) rightKf = {
                time: duration,
                width: leftKf.width,
                height: leftKf.height,
                interpolation: "linear"
            }

            let closest = keyframes.reduce((prev, curr) => Math.abs(curr.time - currentTime) < Math.abs(prev.time - currentTime) ? curr : prev)
            keyframe = Math.abs(closest.time - currentTime) < 0.05 ? closest : null
            
            if (keyframe) {
                resBoxWidth = clientWidth / video.videoWidth * keyframe.width
                resBoxHeight = clientHeight / video.videoHeight * keyframe.height
            } else {
                let t = (currentTime - leftKf.time) / (rightKf.time - leftKf.time)
                switch (rightKf.interpolation) {
                    case 'linear':
                        resBoxWidth = clientWidth / video.videoWidth * linear(leftKf.width, rightKf.width, t)
                        resBoxHeight = clientHeight / video.videoHeight * linear(leftKf.height, rightKf.height, t)
                        break
                    case 'ease':
                        resBoxWidth = clientWidth / video.videoWidth * ease(leftKf.width, rightKf.width, t)
                        resBoxHeight = clientHeight / video.videoHeight * ease(leftKf.height, rightKf.height, t)
                        break
                }    
            }
        } else keyframe = null
    }
    
    let keyframes: Keyframe[] = []
    keyframes = (keyframesString as string).split("\n")
        .map(l => l.replace(/\s/g, ''))
        .filter((s) => s !== '' && s[0] !== "#" && /\d+,\d+,\d+,.+/.test(s))
        .map(s => {
        let data = s.split(",")
        return {
            time: parseInt(data[0]),
            width: parseInt(data[1]),
            height: parseInt(data[2]),
            interpolation: data[3] ?? "linear"
        }
    })
    keyframes.sort((a, b) => a.time - b.time)

    function onMouseMove(e: MouseEvent) {
        if (e.buttons === 1) {
            currentTime = e.offsetX / (e.target as any).clientWidth * duration
        }
    }

    function formatTime(time: number): string {
        let minutes: number = Math.floor(time / 60)
        let seconds: number = Math.floor(time % 60)
        return `${minutes < 10 ? "0" : ""}${minutes}:${seconds < 10 ? "0" : ""}${seconds}`
    }

    function addKeyframe() {
        keyframes.push({
            time: currentTime,
            width: video.videoWidth,
            height: video.videoHeight,
            interpolation: "linear"
        })
        keyframes.sort((a, b) => a.time - b.time)
        keyframes = keyframes
    }

    function removeKeyframe() {
        if (keyframe) keyframes = keyframes.filter(k => k !== keyframe)
    }

    function sync(e: any) {
        currentTime = parseFloat(e.target.value)
    }

    export function save() {
        return keyframes.map(k => `${k.time},${k.width},${k.height},${k.interpolation}`).join("\n")
    }
</script>

<section class="flex flex-col gap-2">
    <div class="min-w-[46rem] max-h-[30rem] flex">
        <div class="relative mx-auto" bind:clientWidth bind:clientHeight>
            <!-- svelte-ignore a11y-media-has-caption -->
            <video 
                bind:paused 
                bind:currentTime
                bind:this={video}
                bind:duration
                src={preview} 
                class="rounded-lg self-center w-full min-h-[20rem]" />
                
            <ResizeBox
                on:changewidth={(w) => {
                    keyframe.width = Math.floor(Math.min(video.videoWidth, Math.max(1, (video.videoWidth / clientWidth * w.detail))))
                }}
                on:changeheight={(h) => {
                    keyframe.height = Math.floor(Math.min(video.videoHeight, Math.max(1, (video.videoHeight / clientHeight * h.detail))))
                }}
                active={keyframe !== null}
                width={resBoxWidth}
                height={resBoxHeight} />
        </div>
    </div>
    
    <div class="flex justify-between items-center">
        <span>{formattedTime}</span>
        <div class="flex gap-1">
            <button on:click={() => paused = !paused} class="icon-button">
                <Fa icon={paused ? faPlay : faPause} />
            </button>
            <button on:click={addKeyframe} class="icon-button">
                <Fa icon={faBookmark} />
            </button>
            <button on:click={removeKeyframe} disabled={keyframe == null} class="icon-button">
                <Fa icon={faXmark} />
            </button>
        </div>
        <span>{formattedDuration}</span>
    </div>

    <div on:mousemove={onMouseMove} on:mousedown={onMouseMove} class="h-4 bg-neutral-800 rounded-md relative">
        <div 
            class="absolute w-1 h-6 -top-1 bg-white rounded-full pointer-events-none z-10" 
            class:bg-sky-400={keyframe} 
            style="left: calc({currentTime / duration * 100}% - 2px)" />
        {#if video}
            {#each keyframes as keyframe}
                <div class="absolute w-0.5 h-4 bg-sky-400 pointer-events-none" style="left: {keyframe.time / duration * 100}%"></div>
            {/each}
        {/if}
    </div>

    <div class="h-16">
        {#if keyframe}
            <PropertyEditor bind:keyframe on:change={sync} />
        {/if}
    </div>
    
</section>