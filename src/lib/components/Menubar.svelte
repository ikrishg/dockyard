<script>
  import clsx from "clsx";
</script>

<header
  class={clsx(
    "flex items-center w-screen min-h-6 h-max",
    "relative before:absolute before:inset-0 before:z-[-1] before:bg-black/18 before:bg-blend-darken backdrop-blur-[67px]"
  )}
>
  <ul
    class={clsx(
      "flex justify-between items-center",
      "text-xs text-center leading-tight",
      "*:*:hover:bg-black/20 *:*:focus:bg-black/20 *:*:transition-colors",
      "*:*:px-2 *:*:py-1.5",
      "*:*:font-menubar",
      "*:flex *:justify-center *:items-end"
    )}
  >
    <li>
      <a class="text-sm font-bold px-2" href="/">Dockyard</a>
    </li>
  </ul>
</header>
