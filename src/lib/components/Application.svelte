<script lang="ts">
  import { onMount } from "svelte";
  import { apps } from "../config/apps.svelte";
  import Window from "./Window.svelte";

  const { id, className, children } = $props();

  const isOpen = $derived(() => {
    const app = $apps[id];
    return app ? app.isOpen : false;
  });
</script>

{#if isOpen()}
  <Window name={id} {className}>
    {@render children()}
  </Window>
{/if}
