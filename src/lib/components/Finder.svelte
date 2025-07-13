<script lang="ts">
  import { onMount } from "svelte";
  import { fade, fly, scale } from "svelte/transition";
  import { flip } from "svelte/animate";
  import { cubicOut } from "svelte/easing";
  import Window from "./Window.svelte";
  import {
    statuses,
    types,
    type Status,
    type Type,
    type YSWS,
  } from "$/lib/config/ysws";
  import clsx from "clsx";

  let data = $state<YSWS[]>([]);
  let selectedStatus = $state<Status>("active");
  let selectedType = $state<Type>("ysws");
  let selectedDateSort = $state<"asc" | "desc">("asc");
  let allowDraft = $state<boolean>(false);
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
      .filter((item) => item.type === selectedType)
      .filter((item) => (allowDraft ? true : !item.draft))
      .sort((a, b) => {
        const sortUtil = new Date(a.end).getTime() - new Date(b.end).getTime();

        return selectedDateSort === "asc" ? sortUtil : -sortUtil;
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
  className="bg-white/80 backdrop-blur-[67px] overflow-hidden text-zinc-900 border"
>
  {#if !isLoading}
    <div class="flex flex-col h-full" in:fade>
      <!-- Mobile Status Filter Toolbar -->
      <div class="block space-y-2 lg:hidden border-b border-zinc-200 px-4 py-2">
        <div class="flex justify-between items-center gap-2">
          <span class="text-sm text-zinc-600 font-medium">Type:</span>
          <div class="space-x-2">
            {#each types as dataType, index}
              <button
                class={clsx(
                  "px-3 py-1 text-sm rounded transition-colors",
                  selectedType === dataType
                    ? "bg-zinc-200 text-zinc-950"
                    : "text-zinc-700 hover:bg-zinc-100 border border-zinc-200"
                )}
                onclick={() => (selectedType = dataType)}
                in:fly={{
                  x: -20,
                  duration: 300,
                  delay: index * 100,
                  easing: cubicOut,
                }}
              >
                {dataType[0].toUpperCase() + dataType.slice(1)}
              </button>
            {/each}
          </div>
        </div>
        <div class="flex justify-between items-center gap-2">
          <span class="text-sm text-zinc-600 font-medium">Status:</span>
          <div class="space-x-2">
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
        <div class="flex justify-between items-center gap-2">
          <span class="text-sm text-zinc-600 font-medium">Sort:</span>
          <div class="space-x-2">
            {#each ["asc", "desc"] as dateSort, index}
              <button
                class={clsx(
                  "px-3 py-1 text-sm rounded transition-colors",
                  selectedDateSort === dateSort
                    ? "bg-zinc-200 text-zinc-950"
                    : "text-zinc-700 hover:bg-zinc-100 border border-zinc-200"
                )}
                onclick={() => (selectedDateSort = dateSort as "asc" | "desc")}
                in:fly={{
                  x: -20,
                  duration: 300,
                  delay: index * 100,
                  easing: cubicOut,
                }}
              >
                {dateSort[0].toUpperCase() + dateSort.slice(1)}
              </button>
            {/each}
          </div>
        </div>
      </div>

      <!-- Desktop Layout with Sidebar -->
      <div class="flex flex-1 overflow-hidden">
        <aside
          class="hidden lg:block w-48 border-r border-zinc-200 p-2 overflow-y-scroll flex-shrink-0"
          style="box-shadow: inset 0 0 10px rgba(0, 0, 0, 0.1);"
        >
          <div class="space-y-1">
            <div
              class="text-xs font-medium text-zinc-500 uppercase tracking-wider px-2 py-1"
            >
              Type
            </div>
            {#each types as dataType, index}
              <button
                class={clsx(
                  "w-full text-left px-2 py-1 text-sm rounded transition-colors",
                  selectedType === dataType
                    ? "bg-zinc-200 text-zinc-950"
                    : "text-zinc-700 hover:bg-zinc-200"
                )}
                onclick={() => (selectedType = dataType)}
                in:fly={{
                  x: -20,
                  duration: 300,
                  delay: index * 100,
                  easing: cubicOut,
                }}
              >
                {dataType[0].toUpperCase() + dataType.slice(1)}
              </button>
            {/each}
          </div>
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
          <div class="space-y-1">
            <div
              class="text-xs font-medium text-zinc-500 uppercase tracking-wider px-2 py-1"
            >
              Sort
            </div>
            {#each ["asc", "desc"] as dateSort, index}
              <button
                class={clsx(
                  "w-full text-left px-2 py-1 text-sm rounded transition-colors",
                  selectedDateSort === dateSort
                    ? "bg-zinc-200 text-zinc-950"
                    : "text-zinc-700 hover:bg-zinc-200"
                )}
                onclick={() => (selectedDateSort = dateSort as "asc" | "desc")}
                in:fly={{
                  x: -20,
                  duration: 300,
                  delay: index * 100,
                  easing: cubicOut,
                }}
              >
                {dateSort[0].toUpperCase() + dateSort.slice(1)}
              </button>
            {/each}
          </div>
        </aside>

        <!-- Main Content Area -->
        <div
          class="bg-zinc-50 flex-1 flex flex-col min-w-0 max-h-[70vh] overflow-y-scroll"
        >
          <div
            class="flex-1"
            in:fly={{ y: 20, duration: 400, delay: 200, easing: cubicOut }}
          >
            <table class="w-full">
              <thead class="border-b bg-zinc-50 border-zinc-200 sticky top-0">
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
                    class="border-b border-zinc-50 hover:bg-zinc-200 transition-colors"
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
                        {dateFormatter(new Date(ysws.end))}
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
