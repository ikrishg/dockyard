<script lang="ts">
  import { onMount } from "svelte";
  import { fade, fly } from "svelte/transition";
  import { cubicOut } from "svelte/easing";
  import { Plus, GitBranch } from "@lucide/svelte";
  import {
    apiBaseUrl,
    type DataItem,
    type DataListElement,
  } from "../config/api";
  import Application from "./Application.svelte";
  import {
    gitHubIssueBaseUrl,
    issueSchema,
    type IssueData,
  } from "$/lib/config/gh-automator";
  import { types } from "../config/api";

  let mode = $state<"choose" | "new" | "edit">("choose");
  let isLoading = $state(true);
  let programs = $state<DataListElement[]>([]);
  let selectedProgramId = $state("");

  const blankFormData: IssueData = {
    id: "",
    name: "",
    type: "ysws",
    draft: true,
    description: "",
    ys: "",
    ws: "",
    website: null,
    "slack-link": "https://hackclub.slack.com/archives/",
    "slack-name": "channel-name",
    timeline: [{ start: "", end: "" }],
  };
  // timezone options for timeline entries
  const timezoneOptions = [
    "-12:00",
    "-11:00",
    "-10:00",
    "-09:00",
    "-08:00",
    "-07:00",
    "-06:00",
    "-05:00",
    "-04:00",
    "-03:00",
    "-02:00",
    "-01:00",
    "+00:00",
    "+01:00",
    "+02:00",
    "+03:00",
    "+04:00",
    "+05:00",
    "+06:00",
    "+07:00",
    "+08:00",
    "+09:00",
    "+10:00",
    "+11:00",
    "+12:00",
    "+13:00",
    "+14:00",
  ];
  let timezone = $state<string>("-04:00");
  let formData = $state<IssueData>({ ...blankFormData });

  type Field =
    | {
        id: keyof IssueData;
        label: string;
        type: "text" | "url" | "checkbox" | "textarea" | "input";
      }
    | {
        id: keyof IssueData;
        label: string;
        type: "select";
        options: string[];
      };

  const formFields: Field[] = [
    { id: "name", label: "Name", type: "text" },
    { id: "draft", label: "Draft", type: "checkbox" },
    { id: "type", label: "Type", type: "select", options: types },
    { id: "description", label: "Description", type: "textarea" },
    { id: "ys", label: "YS", type: "text" },
    { id: "ws", label: "WS", type: "text" },
    { id: "slack-link", label: "Slack Link", type: "url" },
    { id: "slack-name", label: "Slack Name", type: "text" },
    { id: "website", label: "Website", type: "url" },
  ];

  onMount(() => {
    const url = apiBaseUrl;
    url.pathname = "/data.json";
    fetch(url.toString())
      .then((res) => res.json())
      .then((data: DataListElement[]) => {
        programs = data;
        isLoading = false;
      })
      .catch((err) => {
        console.error("Error fetching data:", err);
        isLoading = false;
      });
  });

  function resetForm(type: "new" | "edit" | "choose") {
    formData = { ...blankFormData };
    selectedProgramId = "";
    mode = type;
  }

  function handleProgramSelect(id: DataListElement["id"]) {
    const url = apiBaseUrl;
    url.pathname = `/data/${id}.json`;

    fetch(url.toString())
      .then(async (response) => await response.json())
      .then((json: DataItem) => {
        // convert ISO timestamps to date-only strings for date inputs
        // convert ISO timestamps to datetime-local strings (YYYY-MM-DDTHH:mm)
        const timelineEntries = json.timeline.map((e) => ({
          start: e.start.slice(0, 16),
          end: e.end.slice(0, 16),
        }));
        formData = issueSchema.parse({
          id,
          name: json.name,
          type: [json.type],
          draft: [json.draft],
          description: json.description,
          ys: json.ys,
          ws: json.ws,
          website: json.extern.website,
          "slack-link": json.extern.slack.link,
          "slack-name": json.extern.slack.name,
          timeline: timelineEntries,
        });
      })
      .catch((error) => {
        console.error("Error fetching program data:", error);
      });
  }

  function handleSave() {
    const url = new URL(gitHubIssueBaseUrl.toString());
    if (formData.id.length > 0) {
      url.searchParams.set("id", formData.id);
    } else {
      url.searchParams.set(
        "id",
        formData.name.replace(/[^a-z0-9]+/gi, "-").toLowerCase()
      );
    }
    formFields.forEach((field) => {
      const value = formData[field.id];
      if (field.type === "checkbox") {
        url.searchParams.set(field.id, value ? '"true"' : '"false"');
      } else {
        url.searchParams.set(field.id, String(value ?? ""));
      }
    });

    const formattedTimeline = formData.timeline.map((entry, idx) => {
      let start = entry.start;
      let end = entry.end;

      if (!start.includes("T")) {
        start = `${start}T00:00:00${timezone}`;
      } else {
        start = `${start}:00${timezone}`;
      }
      if (!end.includes("T")) {
        end = `${end}T23:59:59${timezone}`;
      } else {
        end = `${end}:59${timezone}`;
      }
      return { start, end };
    });
    url.searchParams.set("timeline", JSON.stringify(formattedTimeline));

    window.open(url.toString(), "_blank");
  }

  function addTimeline() {
    formData.timeline = [...formData.timeline, { start: "", end: "" }];
  }

  function removeTimeline(index: number) {
    if (formData.timeline.length > 1) {
      formData.timeline = formData.timeline.filter((_, i) => i !== index);
    }
  }
</script>

<Application
  id="xcode"
  className="bg-zinc-900 overflow-hidden text-zinc-100 border border-zinc-700/50 rounded-2xl shadow-2xl max-w-3xl mx-auto "
>
  <div class="p-8 space-y-8">
    {#if isLoading}
      <div class="text-center text-zinc-500 text-base" in:fade>
        Loading programs...
      </div>
    {:else if mode === "choose"}
      <div class="flex flex-col items-center text-center space-y-6" in:fade>
        <img src="/favicon.svg" alt="Xcode" class="h-20 w-20" />
        <h1 class="text-2xl font-semibold text-zinc-100">Dockyard</h1>
        <p class="text-sm text-zinc-400">Warehouse</p>
        <div class="space-y-4 w-full max-w-xs">
          <button
            onclick={() => resetForm("new")}
            class="flex items-center justify-center w-full px-4 py-3 bg-zinc-800 hover:bg-zinc-700 rounded-lg text-zinc-100 text-base font-medium transition"
          >
            <Plus class="w-5 h-5 mr-2" />
            Create New Program
          </button>
          <button
            onclick={() => resetForm("edit")}
            class="flex items-center justify-center w-full px-4 py-3 bg-zinc-800 hover:bg-zinc-700 rounded-lg text-zinc-100 text-base font-medium transition"
          >
            <GitBranch class="w-5 h-5 mr-2" />
            Edit Existing Program
          </button>
        </div>
      </div>
    {:else}
      <form
        class="space-y-4"
        in:fly={{ y: 10, duration: 300, easing: cubicOut }}
      >
        <button
          type="button"
          onclick={() => resetForm("choose")}
          class="text-sm text-blue-400 hover:text-blue-300 transition"
        >
          ← Back
        </button>
        {#if mode === "edit"}
          <div class="space-y-2">
            <label
              for="select-program"
              class="text-sm text-zinc-300 font-medium"
            >
              Select Program
            </label>
            <select
              id="select-program"
              bind:value={selectedProgramId}
              onchange={() => handleProgramSelect(selectedProgramId)}
              class="w-full px-3 py-2 rounded-md bg-zinc-800 border border-zinc-600 text-zinc-100 focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
            >
              <option value="">Select a Program</option>
              {#each programs as prog}
                <option value={prog.id}>{prog.name}</option>
              {/each}
            </select>
          </div>
        {/if}

        {#if mode === "new" || (mode === "edit" && formData.id)}
          {#each formFields as field}
            {#if field.type === "checkbox"}
              <div class="flex items-center space-x-3">
                <input
                  id={field.id}
                  type="checkbox"
                  bind:checked={formData[field.id] as boolean}
                  class="h-5 w-5 text-blue-500 bg-zinc-700 border-zinc-600 rounded focus:ring-2 focus:ring-blue-500"
                />
                <label for={field.id} class="text-sm text-zinc-300"
                  >{field.label}</label
                >
              </div>
            {:else}
              <div class="space-y-2">
                <label
                  for={field.id}
                  class="block text-sm text-zinc-300 font-medium"
                >
                  {field.label}
                </label>
                {#if field.type === "select"}
                  <select
                    id={field.id}
                    bind:value={formData[field.id]}
                    class="w-full px-3 py-2 rounded-md bg-zinc-800 border border-zinc-600 text-zinc-100 shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
                  >
                    {#each field.options as opt}
                      <option value={opt}>{opt}</option>
                    {/each}
                  </select>
                {:else if field.type === "textarea"}
                  <textarea
                    id={field.id}
                    rows="3"
                    bind:value={formData[field.id]}
                    class="w-full px-3 py-2 rounded-md bg-zinc-800 border border-zinc-600 text-zinc-100 placeholder-zinc-500 shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
                  ></textarea>
                {:else}
                  <input
                    id={field.id}
                    type={field.type}
                    bind:value={formData[field.id]}
                    class="w-full px-3 py-2 rounded-md bg-zinc-800 border border-zinc-600 text-zinc-100 placeholder-zinc-500 shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
                  />
                {/if}
              </div>
            {/if}
          {/each}

          <div class="space-y-2">
            <label
              for="timeline"
              class="block text-sm text-zinc-300 font-medium">Timeline</label
            >
            <!-- Timezone selector for timeline entries -->
            <div class="space-y-2">
              <label
                for="timezone"
                class="block text-sm text-zinc-300 font-medium">Timezone</label
              >
              <select
                id="timezone"
                bind:value={timezone}
                class="w-full px-3 py-2 rounded-md bg-zinc-800 border border-zinc-600 text-zinc-100 shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
              >
                {#each timezoneOptions as tz}
                  <option value={tz}>{tz}</option>
                {/each}
              </select>
            </div>
            {#each formData.timeline as entry, index}
              <div
                class="grid gap-2 items-end"
                class:grid-cols-3={formData.timeline.length > 1}
                class:grid-cols-2={formData.timeline.length <= 1}
              >
                <div class="space-y-1">
                  <label for="start-{index}" class="text-xs text-zinc-400"
                    >Start</label
                  >
                  <input
                    id="start-{index}"
                    type="datetime-local"
                    bind:value={formData.timeline[index].start}
                    class="w-full px-3 py-2 rounded-md bg-zinc-800 border border-zinc-600 text-zinc-100 shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
                  />
                </div>
                <div class="space-y-1">
                  <label for="end-{index}" class="text-xs text-zinc-400"
                    >End</label
                  >
                  <input
                    id="end-{index}"
                    type="datetime-local"
                    bind:value={formData.timeline[index].end}
                    class="w-full px-3 py-2 rounded-md bg-zinc-800 border border-zinc-600 text-zinc-100 shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
                  />
                </div>
                {#if index >= 1}
                  <button
                    type="button"
                    onclick={() => removeTimeline(index)}
                    class="px-2 py-1 text-red-500 hover:text-red-400 text-xs font-medium transition"
                  >
                    Remove
                  </button>
                {/if}
              </div>
            {/each}
            <button
              type="button"
              onclick={addTimeline}
              class="mt-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md text-sm font-medium transition"
            >
              Add Timeline
            </button>
          </div>

          <div class="flex space-x-4 pt-4">
            <button
              type="button"
              onclick={handleSave}
              class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-base font-medium transition"
            >
              Save
            </button>
          </div>
        {/if}
      </form>
    {/if}
  </div>
</Application>
