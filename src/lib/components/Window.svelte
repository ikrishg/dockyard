<script lang="ts">
  import clsx from "clsx";

  const { name, className, children } = $props();
</script>

<section
  class={clsx(
    "window absolute max-w-max max-h-max min-w-2xs left-1/2 top-1/2 -translate-1/2",
    className
  )}
  style="opacity: 0; transform: scale(0);"
  data-active="false"
  data-name={name}
>
  <header>
    <div
      class="flex items-center justify-between rounded-t-xl p-2 bg-gray-200 text-zinc-950"
    >
      <div class="flex items-center space-x-2">
        <button
          aria-label="Close Window"
          class="minimize-button w-3 h-3 bg-red-500 rounded-full"
        ></button>
        <button
          aria-label="Minimize Window"
          class="minimize-button w-3 h-3 bg-yellow-500 rounded-full"
        ></button>
        <button
          aria-label="Maximize Window"
          class="maximize-button w-3 h-3 bg-green-500 rounded-full"
        ></button>
      </div>
    </div>
  </header>

  <main class="p-5 max-h-[50vh] overflow-y-scroll">
    {@render children()}
  </main>
</section>
