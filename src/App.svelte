<script lang="ts">
    import { faCheck, faFile, faQuestionCircle, faSort } from "@fortawesome/free-solid-svg-icons"
    import { faGithub } from "@fortawesome/free-brands-svg-icons"
    import { Listbox, ListboxButton, ListboxOption, ListboxOptions, Transition } from "@rgossiaux/svelte-headlessui"
    import Result from './Components/Result.svelte';
    import Options from './Components/Options.svelte';
    import Fa from 'svelte-fa'

    import { wackyWebm } from "./lib/wackywebm/wackywebm";
    import type { Mode } from './lib/wackywebm/modes/base';
    import { Bounce } from "./lib/wackywebm/modes/bounce";
    import { Shrink } from './lib/wackywebm/modes/shrink';
    import { Shutter } from './lib/wackywebm/modes/shutter';
    import { Sporadic } from './lib/wackywebm/modes/sporadic';
    import { Jumpscare } from './lib/wackywebm/modes/jumpscare';
    import { Keyframes } from './lib/wackywebm/modes/keyframes';
    
    let files: FileList
    let video: string
    let stage: string = "init"
    let progress: number = 0
    let processing: boolean = false

    let modes: Mode[] = [
        new Bounce(), 
        new Shrink(), 
        new Shutter(), 
        new Sporadic(), 
        new Jumpscare(),
        new Keyframes()
    ]
    let selectedMode: Mode = modes[0]

    let scale = 4
    let split = 50
    let tempo = 1

    async function elaborate() {
        if (!files) return

        processing = true

        video = await wackyWebm({
            file: files[0],
            mode: selectedMode,
            scale: scale,
            split: split,
            tempo: tempo,
            onProgress: (s, p) => {
                stage = s
                if (!isNaN(p))
                    progress = Math.min(100, Math.max(0, p))
            }
        })

        processing = false
    }
</script>

<main class="h-full bg-neutral-900 text-white flex flex-col overflow-auto">
    <header class="p-4 px-6 flex flex-row justify-between border-b border-neutral-800">
        <h1 class="text-2xl font-bold">WackyWebm <span class="text-lg font-semibold text-gray-200 hover:text-sky-300 transition">Web</span></h1>
        <div class="flex flex-row items-center gap-2">
            <Fa class="text-gray-200 cursor-pointer" size="lg" icon={faQuestionCircle} />
            <Fa class="text-gray-200 cursor-pointer" size="lg" icon={faGithub} />
        </div>
    </header>

    <section class="p-4 flex flex-col gap-2 max-w-[40rem] w-full self-center border border-neutral-800 rounded-xl my-4 shadow-lg">
        <div class="flex flex-row items-center justify-between">
            <span class="font-semibold">Select file:</span>
            <div class="flex flex-row items-center gap-2">
                {#if files && files[0]}
                    <span>{files[0].name}</span>
                {/if}
                <input id="file-input" type="file" class="hidden" bind:files={files}>
                <label for="file-input" class="w-8 h-8 rounded-xl cursor-pointer bg-neutral-800 hover:bg-neutral-700 active:bg-neutral-600 inline-flex items-center justify-center transition">
                    <Fa icon={faFile} />
                </label>
            </div>
        </div>

        <div class="flex flex-row items-center justify-between z-10">
            <span class="font-semibold">Mode: </span>
            <Listbox value={selectedMode} on:change={(e) => (selectedMode = e.detail)}>
                <ListboxButton class="listbox-button">
                    <span class="block truncate">{selectedMode.name}</span>
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
                    <ListboxOptions class="listbox-options" static>
                            {#each modes as mode}
                                <ListboxOption 
                                class={({ active }) => `listbox-option ${
                                    active ? 'bg-neutral-900' : 'text-white'
                                }`}
                                    value={mode}
                                    let:selected>
                                    <span class="flex items-center justify-start gap-2">
                                        {#if selected}
                                            <Fa class="h-4 w-4" icon={faCheck} />
                                        {:else}
                                            <div class="h-4 w-4"></div>
                                        {/if}
                                        <span class={selected && "font-semibold"}>{mode.name}</span>
                                    </span>
                                </ListboxOption>
                            {/each}
                        </ListboxOptions>
                </Transition>
            </Listbox>
        </div>

        <div class="flex flex-row items-center justify-between">
            <span class="font-semibold">Scale: </span>
            <Listbox value={scale} on:change={(e) => (scale = e.detail)}>
                <ListboxButton class="listbox-button">
                    <span class="block truncate">/{scale}</span>
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
                        {#each Array(4) as _, i}
                            <ListboxOption 
                            class={({ active }) => `listbox-option ${
                                active ? 'bg-neutral-900' : 'text-white'
                            }`}
                                value={2**i}
                                let:selected>
                                <span class="flex items-center justify-start gap-2">
                                    {#if selected}
                                        <Fa class="h-4 w-4" icon={faCheck} />
                                    {:else}
                                        <div class="h-4 w-4"></div>
                                    {/if}
                                    <span class={selected && "font-semibold"}>/{2**i}</span>
                                </span>
                            </ListboxOption>
                        {/each}
                    </ListboxOptions>
                </Transition>
            </Listbox>
        </div>

        <div class="flex flex-row items-center justify-between">
            <span class="font-semibold">Split frames: </span>
            <div class="flex flex-row items-center gap-2">
                <label for="split">{split}</label>
                <input type="range" class="slider" id="split" min="20" max="200" step="10" bind:value={split}>
            </div>
        </div>

        <div class="flex flex-row items-center justify-between">
            <span class="font-semibold">Tempo: </span>
            <div class="flex flex-row items-center gap-2">
                <label for="tempo">{tempo.toFixed(1)}</label>
                <input type="range" class="slider" id="tempo" min="1" max="8" step="0.1" bind:value={tempo}>
            </div>
        </div>
        
        <Options mode={selectedMode} />
        
        <button 
            class="button self-end"
            disabled={processing || !files || !files[0]} 
            on:click={elaborate}>
            Elaborate
        </button>
        <span class="font-semibold">Stage: 
            <span class="font-normal">{stage}</span>
        </span>
        <div class="w-full rounded-lg overflow-hidden bg-neutral-800">
            <div class="h-4 bg-sky-500 transition-all" style="width: {(progress * 100).toFixed()}%"></div>
        </div>
    </section>

    {#if video}
        <Result video={video} />
    {/if}
</main>