<script>
  import { onMount } from "svelte";
  import Window from "./Window.svelte";

  // @ts-ignore
  onMount(() => {
    // @ts-ignore
    window.onSpotifyIframeApiReady = (IFrameAPI) => {
      const element = document.getElementById("embed-iframe");
      const options = {
        uri: "spotify:playlist:7bu7BZEusLNJSaAuUUZBKn",
      };
      const callback = () => {};
      IFrameAPI.createController(element, options, callback);
    };
  });
</script>

<Window name="music" className="bg-white/70 backdrop-blur-[67px]">
  <article class="prose prose-zinc space-y-1"></article>
  <div id="embed-iframe"></div>
  <script src="https://open.spotify.com/embed/iframe-api/v1" async></script>
</Window>
