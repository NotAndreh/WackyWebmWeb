<script lang="ts">
    import { Transition } from "@rgossiaux/svelte-headlessui";

    export let video: string;
</script>

<Transition
    show={!!video}
    enter="transition ease"
    enterFrom="transform scale-90 opacity-0"
    enterTo="transform scale-100 opacity-100"
    as="section"
    class="p-4 flex flex-col origin-top gap-2 max-w-[40rem] w-full self-center border border-neutral-800 rounded-xl m-4 mt-0 shadow-lg"
>
    <span class="font-semibold">Result:</span>
    <!-- svelte-ignore a11y-media-has-caption -->
    <video src={video} controls class="rounded-lg self-start" />
</Transition>
