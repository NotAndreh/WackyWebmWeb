<script lang="ts">
    import type { Mode } from "src/lib/wackywebm/modes/base"

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
            <textarea class="input-text" bind:value={option.value}></textarea>
        {:else if option.type === "boolean"}
            <input type="checkbox" class="toggle" bind:checked={option.value}>
        {/if}
    </div>
{/each}
