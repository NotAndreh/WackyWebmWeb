<script lang="ts">
    import { faEdit } from "@fortawesome/free-solid-svg-icons"
    import type { Mode } from "src/lib/wackywebm/modes/base"
    import Fa from "svelte-fa"

    export let preview: boolean
    export let mode: Mode
</script>

{#each Object.entries(mode.options) as [_, option]}
    <div class="flex flex-row items-center justify-between">
        <span class="font-semibold">{option.name}: </span>
        {#if option.type === "number"}
            <input type="number" class="input-text" bind:value={option.value}>
        {:else if option.type === "string"}
            <input type="text" class="input-text" bind:value={option.value}>
        {:else if option.type === "textarea"}
            <div class="flex gap-2">
                {#if mode.name === "Keyframes" && option.name === "Keyframes"}
                    <button on:click class="icon-button" disabled={preview}>
                        <Fa icon={faEdit} />
                    </button>
                {/if}
                <textarea class="input-text" bind:value={option.value}></textarea>
            </div>
        {:else if option.type === "boolean"}
            <input type="checkbox" class="toggle" bind:checked={option.value}>
        {/if}
    </div>
{/each}

<style lang="scss">
    textarea::-webkit-resizer {
        @apply bg-neutral-700;
    }    
</style>