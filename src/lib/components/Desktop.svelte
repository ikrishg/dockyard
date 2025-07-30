<script>
  import { apps, open } from "$/lib/config/apps.svelte";
</script>

<div class="my-4 flex flex-row flex-wrap gap-6">
  {#each Object.values($apps).filter((app) => app.onDesktop) as app (app.id)}
    <button
      type="button"
      class="w-20 flex flex-col items-center focus:outline-none"
      onclick={() => open(app.id)}
      aria-label={"Open " + app.name}
    >
      <img
        src={app.icon}
        alt={app.name}
        class="w-14 h-14 mx-auto mb-2 hover:scale-110 transition-transform duration-200"
      />
      <span class="text-xs text-white truncate">{app.name}</span>
    </button>
  {/each}
</div>
