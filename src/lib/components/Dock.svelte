<script>
  import clsx from "clsx";

  import finderImage from "$/assets/finder.png";
  import musicImage from "$/assets/music.png";
  import settingsImage from "$/assets/settings.png";
  import xcodeImage from "$/assets/xcode.png";

  const items = [
    { name: "Finder", image: finderImage },
    { name: "Music", image: musicImage },
    { name: "Settings", image: settingsImage },
    { name: "Xcode", image: xcodeImage },
  ];
</script>

<nav
  class={clsx(
    "flex items-center w-max min-w-xs min-h-16 rounded-3xl",
    "px-5",
    "fixed left-0 right-0 bottom-2 mx-auto",
    "bg-white/10 backdrop-blur-[67px]"
  )}
>
  <ul
    class={clsx(
      "flex justify-between gap-5 items-center w-full",
      "*:hover:scale-125 *:hover:-translate-y-2.5 *:transition-transform"
    )}
  >
    {#each items as item}
      <li>
        <button>
          <img src={item.image} alt={item.name} width={50} height={50} />
        </button>
      </li>
    {/each}
  </ul>
</nav>
