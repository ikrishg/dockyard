<script lang="ts">
  import { onMount } from "svelte";
  import { fade, fly } from "svelte/transition";
  import { flip } from "svelte/animate";
  import { cubicOut } from "svelte/easing";
  import {
    statuses,
    types,
    type Status,
    type Type,
    type DataListElement,
    apiBaseUrl,
  } from "$/lib/config/api";
  import clsx from "clsx";
  import Application from "./Application.svelte";
  import { ArrowUp, ArrowDown } from "@lucide/svelte";

  let data = $state<DataListElement[]>([]);
  let selectedStatus = $state<Status>("active");
  let selectedType = $state<Type>("ysws");
  let selectedDateSort = $state<"asc" | "desc">("asc");
  let allowDraft = $state<boolean>(false);
  let isLoading = $state(true);

  onMount(() => {
    const url = apiBaseUrl;
    url.pathname = "/data.json";

    fetch(url.toString())
      .then((response) => response.json())
      .then((json) => {
        data = json as DataListElement[];
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

  const toggleSort = () => {
    selectedDateSort = selectedDateSort === "asc" ? "desc" : "asc";
  };
</script>

<Application
  id="finder"
  className="bg-zinc-900/90 backdrop-blur-2xl overflow-hidden text-zinc-100 border border-zinc-700/50 max-w-[90vw] max-h-[80vh]"
>
  {#if !isLoading}
    <div class="flex flex-col h-full" in:fade>
      <div
        class="flex items-center md:hidden border-b border-zinc-800 px-4 py-2 space-x-4 overflow-x-auto"
      >
        <div class="flex items-center gap-2 flex-shrink-0">
          <span class="text-sm text-zinc-400 font-medium">Type:</span>
          <div
            class="flex items-center space-x-1 bg-zinc-800/50 p-1 rounded-md"
          >
            {#each types as dataType}
              <button
                class={clsx(
                  "px-2 py-0.5 text-xs rounded transition-colors flex-shrink-0",
                  selectedType === dataType
                    ? "bg-blue-600 text-white"
                    : "text-zinc-300 hover:bg-zinc-700/50"
                )}
                onclick={() => (selectedType = dataType)}
              >
                {dataType === "ysws"
                  ? "YSWS"
                  : dataType[0].toUpperCase() + dataType.slice(1)}
              </button>
            {/each}
          </div>
        </div>
        <div class="flex items-center gap-2 flex-shrink-0">
          <span class="text-sm text-zinc-400 font-medium">Status:</span>
          <div
            class="flex items-center space-x-1 bg-zinc-800/50 p-1 rounded-md"
          >
            {#each statuses as status}
              <button
                class={clsx(
                  "px-2 py-0.5 text-xs rounded transition-colors flex-shrink-0",
                  selectedStatus === status
                    ? "bg-blue-600 text-white"
                    : "text-zinc-300 hover:bg-zinc-700/50"
                )}
                onclick={() => (selectedStatus = status)}
              >
                {status[0].toUpperCase() + status.slice(1)}
              </button>
            {/each}
          </div>
        </div>
      </div>

      <div class="flex flex-1 overflow-hidden">
        <aside
          class="hidden md:block w-48 border-r border-zinc-800 p-2 overflow-y-scroll flex-shrink-0 bg-zinc-900/80"
        >
          <div class="space-y-1">
            <div
              class="text-xs font-medium text-zinc-400 uppercase tracking-wider px-2 py-1"
            >
              Type
            </div>
            {#each types as dataType, index}
              <button
                class={clsx(
                  "w-full text-left px-2 py-1 text-sm rounded transition-colors",
                  selectedType === dataType
                    ? "bg-blue-600 text-zinc-50"
                    : "text-zinc-300 hover:bg-zinc-700/50"
                )}
                onclick={() => (selectedType = dataType)}
                in:fly={{
                  x: -20,
                  duration: 300,
                  delay: index * 100,
                  easing: cubicOut,
                }}
              >
                {dataType === "ysws"
                  ? "YSWS"
                  : dataType[0].toUpperCase() + dataType.slice(1)}
              </button>
            {/each}
          </div>
          <div class="space-y-1 mt-4">
            <div
              class="text-xs font-medium text-zinc-400 uppercase tracking-wider px-2 py-1"
            >
              Status
            </div>
            {#each statuses as status, index}
              <button
                class={clsx(
                  "w-full text-left px-2 py-1 text-sm rounded transition-colors",
                  selectedStatus === status
                    ? "bg-blue-600 text-zinc-50"
                    : "text-zinc-300 hover:bg-zinc-700/50"
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
        </aside>

        <!-- Main Content Area -->
        <div
          class="bg-zinc-800/60 flex-1 flex flex-col min-w-0 min-h-0 overflow-y-scroll"
        >
          <div
            class="flex-1"
            in:fly={{ y: 20, duration: 400, delay: 200, easing: cubicOut }}
          >
            <table class="w-full">
              <thead
                class="border-b bg-zinc-900/70 backdrop-blur-xl border-zinc-700 sticky top-0"
              >
                <tr>
                  <th
                    class="text-left px-4 py-2 text-xs font-medium text-zinc-400 uppercase tracking-wider w-full"
                  >
                    Name
                  </th>
                  <th
                    class="text-right px-4 py-2 text-xs font-medium text-zinc-400 uppercase tracking-wider w-32"
                  >
                    <button
                      onclick={toggleSort}
                      class="flex items-center gap-1 justify-end w-full"
                    >
                      Deadline
                      {#if selectedDateSort === "asc"}
                        <ArrowUp class="w-3 h-3" />
                      {:else}
                        <ArrowDown class="w-3 h-3" />
                      {/if}
                    </button>
                  </th>
                </tr>
              </thead>

              <tbody>
                {#each filteredData as ysws, index (ysws.name)}
                  <tr
                    class="border-b border-zinc-800 hover:bg-zinc-700/50 transition-colors"
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
                      <h3 class="text-lg font-bold text-zinc-100">
                        {ysws.name}
                      </h3>
                      <p class="text-sm w-[30ch] text-zinc-300 leading-relaxed">
                        {ysws.description}
                      </p>
                    </td>

                    <td class="px-4 py-3 text-right align-top">
                      <span class="text-sm text-zinc-400">
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
                <p class="text-sm text-zinc-400 font-medium">No items</p>
                <p class="text-xs text-zinc-500 mt-1">This folder is empty.</p>
              </div>
            {/if}
          </div>
        </div>
      </div>
    </div>
  {/if}
</Application>
