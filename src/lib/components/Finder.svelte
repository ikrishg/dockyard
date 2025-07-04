<script lang="ts">
  import { onMount } from "svelte";
  import { fade, fly, scale } from "svelte/transition";
  import { flip } from "svelte/animate";
  import { cubicOut } from "svelte/easing";
  import Window from "./Window.svelte";
  import { statuses, type status, type YSWS } from "$/config/ysws";
  import clsx from "clsx";

  let data = $state<YSWS[]>([]);
  let selectedStatus = $state<status>("active");
  let isLoading = $state(true);

  onMount(() => {
    const url = new URL(window.location.href);
    url.pathname = "/api.json";

    fetch(url.toString())
      .then((response) => response.json())
      .then((json) => {
        data = json as YSWS[];
        isLoading = false;
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        isLoading = false;
      });
  });

  const filteredData = $derived(
    data
      .filter((item) => item.status === selectedStatus)
      .sort((a, b) => {
        return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
      })
  );

  const dateFormatter = (date: Date) => {
    return Intl.DateTimeFormat("en-US", {
      hour: "numeric",
      minute: "numeric",
      month: "short",
      day: "numeric",
      year:
        new Date(date).getFullYear() !== new Date().getFullYear()
          ? "numeric"
          : undefined,
    }).format(date);
  };
</script>

<Window
  name="finder"
  className="bg-zinc-50 overflow-hidden text-zinc-900 backdrop-blur-[67px] border border-zinc-200"
>
  {#if !isLoading}
    <div class="flex flex-col h-full" in:fade>
      <!-- Mobile Status Filter Toolbar -->
      <div class="block lg:hidden bg-white border-b border-zinc-200 px-4 py-2">
        <div class="flex items-center gap-2">
          <span class="text-sm text-zinc-600 font-medium">Status:</span>
          {#each statuses as status, index}
            <button
              class={clsx(
                "px-3 py-1 text-sm rounded transition-colors",
                selectedStatus === status
                  ? "bg-zinc-200 text-zinc-950"
                  : "text-zinc-700 hover:bg-zinc-100 border border-zinc-200"
              )}
              onclick={() => (selectedStatus = status)}
              in:fly={{
                x: -20,
                duration: 300,
                delay: index * 100,
                easing: cubicOut,
              }}
            >
              {status[0].toUpperCase() + status.slice(1)}
            </button>
          {/each}
        </div>
      </div>

      <!-- Desktop Layout with Sidebar -->
      <div class="flex flex-1 overflow-hidden">
        <div
          class="hidden lg:block w-48 bg-zinc-50 border-r border-zinc-200 p-2 max-h-[50vh] overflow-y-scroll flex-shrink-0"
        >
          <div class="space-y-1">
            <div
              class="text-xs font-medium text-zinc-500 uppercase tracking-wider px-2 py-1"
            >
              Status
            </div>
            {#each statuses as status, index}
              <button
                class={clsx(
                  "w-full text-left px-2 py-1 text-sm rounded transition-colors",
                  selectedStatus === status
                    ? "bg-zinc-200 text-zinc-950"
                    : "text-zinc-700 hover:bg-zinc-200"
                )}
                onclick={() => (selectedStatus = status)}
                in:fly={{
                  x: -20,
                  duration: 300,
                  delay: index * 100,
                  easing: cubicOut,
                }}
              >
                {status[0].toUpperCase() + status.slice(1)}
              </button>
            {/each}
          </div>
        </div>

        <!-- Main Content Area -->
        <div
          class="flex-1 flex flex-col min-w-0 max-h-[70vh] overflow-y-scroll"
        >
          <div
            class="flex-1 bg-white"
            in:fly={{ y: 20, duration: 400, delay: 200, easing: cubicOut }}
          >
            <table class="w-full">
              <thead class="bg-white border-b border-zinc-200 sticky top-0">
                <tr>
                  <th
                    class="text-left px-4 py-2 text-xs font-medium text-zinc-600 uppercase tracking-wider w-full"
                  >
                    Name
                  </th>
                  <th
                    class="text-right px-4 py-2 text-xs font-medium text-zinc-600 uppercase tracking-wider w-32"
                  >
                    Deadline
                  </th>
                </tr>
              </thead>

              <tbody>
                {#each filteredData as ysws, index (ysws.name)}
                  <tr
                    class="border-b border-zinc-50 hover:bg-zinc-50 transition-colors cursor-pointer"
                    in:fly={{
                      y: 20,
                      duration: 400,
                      delay: index * 50,
                      easing: cubicOut,
                    }}
                    out:fly={{ y: -20, duration: 300, easing: cubicOut }}
                    animate:flip={{ duration: 300, easing: cubicOut }}
                  >
                    <td class="px-4 py-3 align-top">
                      <h3 class="text-sm font-medium text-zinc-900">
                        {ysws.name}
                      </h3>
                      <p class="text-sm text-zinc-700 leading-relaxed">
                        {ysws.description}
                      </p>
                    </td>

                    <td class="px-4 py-3 text-right align-top">
                      <span class="text-sm text-zinc-700">
                        {dateFormatter(new Date(ysws.deadline))}
                      </span>
                    </td>
                  </tr>
                {/each}
              </tbody>
            </table>

            {#if filteredData.length === 0}
              <div
                class="flex flex-col items-center justify-center py-16 min-w-xs text-zinc-500"
                in:fade={{ duration: 400, delay: 200 }}
              >
                <p class="text-sm text-zinc-600 font-medium">No items</p>
                <p class="text-xs text-zinc-500 mt-1">This folder is empty.</p>
              </div>
            {/if}
          </div>
        </div>
      </div>
    </div>
  {/if}
</Window>
