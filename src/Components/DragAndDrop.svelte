<script lang="ts">
    import { createEventDispatcher } from "svelte"
    import { faFile } from "@fortawesome/free-solid-svg-icons"
    import Fa from "svelte-fa"

    const dispatch = createEventDispatcher()
    
    let drag = false

    document.body.addEventListener("dragenter", handleDragEnter)

    function handleDragEnter(e: DragEvent) {
        e.stopPropagation()
        e.preventDefault()
        if (e.dataTransfer.types.includes("Files")) {
            drag = true
        }
    }

    function handleDragLeave(e: DragEvent) {
        e.stopPropagation()
        e.preventDefault()
        drag = false
    }

    function handleDrop(e: DragEvent) {
        e.stopPropagation()
        e.preventDefault()
        drag = false
        dispatch("drop", e.dataTransfer.files)
    }

    function handleDragOver(e: DragEvent) {
        e.stopPropagation()
        e.preventDefault()
    }
</script>

<div 
    on:dragenter={handleDragEnter}
    on:dragleave={handleDragLeave}
    on:dragover={handleDragOver} 
    on:drop={handleDrop} 
    class:hidden={!drag} 
    class="fixed h-full w-full bg-black/40 flex items-center justify-center z-[999]">
    <span class="p-12 bg-neutral-900/70 rounded-xl font-semibold text-xl flex flex-col gap-4 pointer-events-none border-dashed border-2 border-neutral-800">
        <Fa icon={faFile} />
        Drop files here
    </span>
</div>