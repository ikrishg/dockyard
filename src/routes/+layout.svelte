<script lang="ts">
  import "$/app.css";
  import Dock from "$/lib/components/Dock.svelte";
  import Menubar from "$/lib/components/Menubar.svelte";

  let { children } = $props();

  export const prerender = true;
  export const ssr = false;
</script>

<Menubar />
<main>
  {@render children()}
</main>
<Dock />
