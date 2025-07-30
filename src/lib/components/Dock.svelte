<script>
  import clsx from "clsx";
  import { apps, open } from "$/lib/config/apps.svelte";
</script>

<nav
  class={clsx(
    "flex items-center w-max min-w-3xs min-h-16 rounded-3xl",
    "px-5",
    "fixed left-0 right-0 bottom-2 mx-auto",
    "bg-white/10 backdrop-blur-[67px]",
    "z-[99999]"
  )}
>
  <ul
    class={clsx(
      "flex justify-between gap-3 items-center w-full",
      "*:hover:scale-125 *:hover:-translate-y-2.5 *:transition-transform"
    )}
  >
    {#each Object.values($apps).filter((a) => a.inDock) as app}
      <li>
        <button onclick={() => open(app.id)}>
          <img src={app.icon} alt={app.name} width={50} height={50} />
        </button>
      </li>
    {/each}
  </ul>
</nav>
