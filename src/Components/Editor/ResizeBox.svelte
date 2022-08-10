<script lang="ts">
    import { createEventDispatcher } from "svelte";

    export let width: number
    export let height: number
    export let active: boolean = false
    let resizing = "none"
    let div: HTMLDivElement

    const dispatch = createEventDispatcher<{
        changewidth: number
        changeheight: number
    }>()

    function onMouseMove(e: MouseEvent) {
        if (!active) return
        if (resizing == "width") {
            dispatch("changewidth", e.clientX - div.getBoundingClientRect().left)
        } else if (resizing == "height") {
            dispatch("changeheight", e.clientY - div.getBoundingClientRect().top)
        }
    }
</script>

<div
    bind:this={div}
    class="absolute top-0 left-0 outline-dashed outline-4 outline-sky-500 rounded-lg crop"
    style="width: {width}px; height: {height}px; {!active && "outline-color: white"}"
>
    <div on:mousedown={() => resizing = "width"} class="crop-line crop-right" class:active></div>
    <div on:mousedown={() => resizing = "height"} class="crop-line crop-bottom" class:active></div>
</div>

<svelte:window 
    on:mouseup={() => resizing = "none"}
    on:mousemove={onMouseMove}
/>

<style lang="scss">
    .crop .crop-line {
        position: absolute;
        transition: all 0.25s ease;
    }
    .crop .crop-bottom {
        bottom: -5px;
        left: 0;
        right: 0;
        height: 5px;
        cursor: s-resize;
    }
    .crop .crop-right {
        top: 0;
        right: -5px;
        bottom: 0;
        width: 5px;
        cursor: e-resize;
    }
    .crop .crop-line:not(.active) {
        cursor: default;
    }
</style>