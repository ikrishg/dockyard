<script lang="ts">
  import clsx from "clsx";
  import gsap from "gsap";
  import { Draggable } from "gsap/Draggable";

  import { onMount } from "svelte";

  onMount(() => {
    gsap.registerPlugin(Draggable);

    const windowElement = document.querySelector(".window");

    if (windowElement) {
      Draggable.create(windowElement, {
        bounds: document.querySelector("html"),
        trigger: windowElement.querySelector("header"),
      });
    }
  });

  const { className, children } = $props();
</script>

<section
  class={clsx(
    "window absolute left-1/2 top-1/2 -translate-1/2 max-w-max max-h-max min-w-2xs",
    className
  )}
>
  <header>
    <div
      class="flex items-center justify-between rounded-t-xl p-2 bg-gray-200 text-zinc-950"
    >
      <div class="flex items-center space-x-2">
        <button
          aria-label="Close Window"
          class="w-3 h-3 bg-red-500 rounded-full"
        ></button>
        <button
          aria-label="Minimize Window"
          class="w-3 h-3 bg-yellow-500 rounded-full"
        ></button>
        <button
          aria-label="Maximize Window"
          class="w-3 h-3 bg-green-500 rounded-full"
        ></button>
      </div>
    </div>
  </header>

  <main class="p-5">
    {@render children()}
  </main>
</section>
