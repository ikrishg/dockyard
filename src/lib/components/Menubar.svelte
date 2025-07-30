<script lang="ts">
  import clsx from "clsx";
  import * as Menubar from "$lib/components/ui/menubar/index.js";
  import DockyardIcon from "$/assets/icon.svg";
  import { Github, Slack } from "@lucide/svelte";
  import { open } from "../config/apps.svelte";
</script>

<Menubar.Root
  class={clsx(
    "flex items-center w-full h-8 px-2",
    "bg-white/80 dark:bg-black/30",
    "border-b border-white/30 dark:border-black/30 rounded-none",
    "backdrop-blur-lg"
  )}
>
  <Menubar.Menu>
    <Menubar.Trigger
      class="relative inline-flex items-center justify-center rounded-full hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
    >
      <img src={DockyardIcon} alt="Dockyard icon" class="w-4 h-4" />
    </Menubar.Trigger>
    <Menubar.Content
      class="inline-block bg-white/70 dark:bg-black/80 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 rounded-md shadow-md"
    >
      <a
        href="https://github.com/kkrishguptaa/dockyard"
        target="_blank"
        rel="noopener noreferrer"
        class="block"
      >
        <Menubar.Item class="text-xs">
          GitHub

          <Menubar.Shortcut>
            <Github class="h-4 w-4" />
          </Menubar.Shortcut>
        </Menubar.Item>
      </a>
      <a
        href="https://hackclub.slack.com/archives/C05S5JTAGF5"
        target="_blank"
        rel="noopener noreferrer"
        class="block"
      >
        <Menubar.Item class="text-xs">
          Slack: #krishtopia

          <Menubar.Shortcut>
            <Slack class="h-4 w-4" />
          </Menubar.Shortcut>
        </Menubar.Item>
      </a>
    </Menubar.Content>
  </Menubar.Menu>
  <Menubar.Menu>
    <Menubar.Trigger
      class="relative inline-flex items-center justify-center rounded-full hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
    >
      <span class="text-sm font-bold px-1">Dockyard</span>
    </Menubar.Trigger>
    <Menubar.Content
      class="inline-block bg-white/70 dark:bg-black/80 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 rounded-md shadow-md"
    >
      <button class="block w-full" onclick={() => open("finder")}>
        <Menubar.Item class="text-xs">Finder</Menubar.Item>
      </button>
    </Menubar.Content>
  </Menubar.Menu>
</Menubar.Root>
