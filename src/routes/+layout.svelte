<script lang="ts">
  import "$/app.css";
  import Dock from "$/lib/components/Dock.svelte";
  import Desktop from "$/lib/components/Desktop.svelte";
  import Menubar from "$/lib/components/Menubar.svelte";

  let { children } = $props();
</script>

<Menubar />
<main id="main">
  <Desktop />
  {@render children()}
</main>
<Dock />
