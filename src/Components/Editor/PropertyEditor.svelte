<script lang="ts">
    import { Listbox, ListboxButton, ListboxOptions, ListboxOption, Transition } from "@rgossiaux/svelte-headlessui";
    import { faSort, faCheck } from "@fortawesome/free-solid-svg-icons";
    import type { Keyframe } from "./types";
    import Fa from "svelte-fa";
    
    export let keyframe: Keyframe | null
</script>

<div class="flex justify-between items-center gap-2">
    <div class="flex flex-col flex-1">
        <span>Time:</span>
        <input type="number" id="property-time" class="input-text w-full max-w-none" bind:value={keyframe.time} on:change>
    </div>
    <div class="flex flex-col flex-1">
        <span>Width:</span>
        <input type="number" id="property-width" class="input-text w-full max-w-none" bind:value={keyframe.width}>
    </div>
    <div class="flex flex-col flex-1">
        <span>Height:</span>
        <input type="number" id="property-height" class="input-text w-full max-w-none" bind:value={keyframe.height}>
    </div>
    <div class="flex flex-col flex-1">
        <span>Interpolation:</span>
        <Listbox value={keyframe.interpolation} on:change={(e) => (keyframe.interpolation = e.detail)}>
            <div class="relative">
                <ListboxButton class="listbox-button w-full max-w-none">
                    <span class="block truncate">{keyframe.interpolation}</span>
                    <span class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                        <Fa class="h-5 w-5" icon={faSort} />
                    </span>
                </ListboxButton>
                <Transition
                    enter="transition ease"
                    enterFrom="transform scale-90 opacity-0"
                    enterTo="transform scale-100 opacity-100"
                    leave="transition ease"
                    leaveFrom="transform scale-100 opacity-100"
                    leaveTo="transform scale-90 opacity-0"
                >
                    <ListboxOptions class="listbox-options">
                        <ListboxOption 
                            class={({ active }) => `listbox-option ${
                                active ? 'bg-neutral-900' : 'text-white'
                            }`}
                            value="linear"
                            let:selected>
                            <span class="flex items-center justify-start gap-2">
                                {#if selected}
                                    <Fa class="h-4 w-4" icon={faCheck} />
                                {:else}
                                    <div class="h-4 w-4"></div>
                                {/if}
                                <span class={selected && "font-semibold"}>linear</span>
                            </span>
                        </ListboxOption>
                        <ListboxOption 
                            class={({ active }) => `listbox-option ${
                                active ? 'bg-neutral-900' : 'text-white'
                            }`}
                            value="ease"
                            let:selected>
                            <span class="flex items-center justify-start gap-2">
                                {#if selected}
                                    <Fa class="h-4 w-4" icon={faCheck} />
                                {:else}
                                    <div class="h-4 w-4"></div>
                                {/if}
                                <span class={selected && "font-semibold"}>ease</span>
                            </span>
                        </ListboxOption>
                        <ListboxOption 
                            class={({ active }) => `listbox-option ${
                                active ? 'bg-neutral-900' : 'text-white'
                            }`}
                            value="instant"
                            let:selected>
                            <span class="flex items-center justify-start gap-2">
                                {#if selected}
                                    <Fa class="h-4 w-4" icon={faCheck} />
                                {:else}
                                    <div class="h-4 w-4"></div>
                                {/if}
                                <span class={selected && "font-semibold"}>instant</span>
                            </span>
                        </ListboxOption>
                    </ListboxOptions>
                </Transition>
            </div>
        </Listbox>
    </div>
</div>