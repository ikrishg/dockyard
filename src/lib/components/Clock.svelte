<script lang="ts">
  import { onMount, onDestroy } from "svelte";
  import { fade, fly } from "svelte/transition";
  import { cubicOut } from "svelte/easing";
  import type { YSWS } from "$/lib/config/ysws";
  import { apiBaseUrl } from "../config/api";
  import Application from "./Application.svelte";

  let data = $state<YSWS[]>([]);
  let isLoading = $state(true);
  let now = $state(new Date());

  let interval: ReturnType<typeof setInterval>;

  onMount(() => {
    const url = apiBaseUrl;
    url.pathname = "/data.json";

    fetch(url.toString())
      .then((response) => response.json())
      .then((json) => {
        const now = new Date();
        data = (json as YSWS[])
          .filter((item) => new Date(item.end).getTime() > now.getTime())
          .sort(
            (a, b) => new Date(a.end).getTime() - new Date(b.end).getTime()
          );
        isLoading = false;
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        isLoading = false;
      });

    interval = setInterval(() => {
      now = new Date();
    }, 1000);
  });

  onDestroy(() => {
    clearInterval(interval);
  });

  const calculateTimeLeft = (endDate: Date) => {
    const difference = new Date(endDate).getTime() - now.getTime();

    if (difference <= 0) {
      return "ENDED";
    }

    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((difference / 1000 / 60) % 60);
    const seconds = Math.floor((difference / 1000) % 60);

    return `${days}d ${hours}h ${minutes}m ${seconds}s`;
  };
</script>

<Application
  id="clock"
  className="bg-black/80 backdrop-blur-2xl overflow-hidden text-white border border-zinc-700/50"
>
  <div class="flex flex-col h-full" in:fade>
    <div class="p-4 border-b border-zinc-800/50">
      <h1 class="text-2xl font-bold text-orange-500">YSWS Timer</h1>
    </div>
    {#if isLoading}
      <div class="flex items-center justify-center h-full">
        <p>Loading...</p>
      </div>
    {:else}
      <div class="overflow-y-auto flex-1">
        <ul class="divide-y divide-zinc-800/50">
          {#each data as event (event.name)}
            <li class="p-4" in:fly={{ y: 20, duration: 300, easing: cubicOut }}>
              <div class="flex justify-between items-baseline gap-4">
                <div>
                  <p>{event.name}</p>
                </div>
                <div class="text-right flex-shrink-0 pl-4">
                  <p class="text-lg font-light font-mono">
                    {calculateTimeLeft(new Date(event.end))}
                  </p>
                </div>
              </div>
            </li>
          {/each}
        </ul>
      </div>
    {/if}
  </div>
</Application>
