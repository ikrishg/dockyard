<script lang="ts">
  import "$/app.css";
  import Dock from "$/lib/components/Dock.svelte";
  import Menubar from "$/lib/components/Menubar.svelte";

  let { children } = $props();
</script>

<Menubar />
<main id="main">
  {@render children()}
</main>
<Dock />
