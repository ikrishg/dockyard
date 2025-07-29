<script lang="ts">
  import clsx from "clsx";
  import gsap from "gsap";
  import { Draggable } from "gsap/Draggable";
  import InertiaPlugin from "gsap/InertiaPlugin";
  import { onMount } from "svelte";
  import { minimize } from "../config/apps.svelte";
  import { cubicIn, cubicOut, quintIn, quintOut } from "svelte/easing";
  import type { Snippet } from "svelte";
  import { fade, scale } from "svelte/transition";

  type Props = {
    name: string;
    className?: string;
    children: Snippet;
  };

  const { name, className, children }: Props = $props();

  let windowElement: HTMLElement;

  onMount(() => {
    gsap.registerPlugin(Draggable);
    gsap.registerPlugin(InertiaPlugin);

    Draggable.create(windowElement, {
      inertia: true,
      bounds: document.getElementById("main"),
      allowEventDefault: true,
      onClick: () => {
        document.body.setAttribute("data-focus-window", name || "");
      },
    });
  });
</script>

<section
  class={clsx(
    "window absolute min-w-xs max-w-max max-h-max left-1/2 top-1/2 -translate-1/2 overflow-hidden",
    className
  )}
  data-active="false"
  data-name={name}
  data-focus="false"
  in:fade
  out:scale
  bind:this={windowElement}
>
  <header>
    <div
      class="flex items-center justify-between rounded-t-xl p-2 bg-zinc-900 text-zinc-100"
    >
      <div class="flex items-center space-x-2">
        <button
          aria-label="Close Window"
          class="w-3 h-3 bg-red-500 hover:bg-red-600 transition-colors rounded-full"
          onclick={() => minimize(name)}
        ></button>
        <button
          aria-label="Minimize Window"
          class="w-3 h-3 bg-yellow-500 hover:bg-yellow-600 rounded-full"
          onclick={() => minimize(name)}
        ></button>
        <button
          aria-label="Maximize Window"
          class="w-3 h-3 bg-green-500 rounded-full"
        ></button>
      </div>
    </div>
  </header>

  <main class="max-h-[70vh] overflow-y-scroll cursor-normal">
    {@render children()}
  </main>
</section>
