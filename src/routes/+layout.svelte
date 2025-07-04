<script lang="ts">
  import "$/app.css";
  import { apps, minimize, open, type App } from "$/config/apps.svelte";
  import Dock from "$/lib/components/Dock.svelte";
  import Menubar from "$/lib/components/Menubar.svelte";

  let { children } = $props();

  import gsap from "gsap";
  import { Draggable } from "gsap/Draggable";
  import InertiaPlugin from "gsap/InertiaPlugin";
  import { onMount } from "svelte";

  onMount(() => {
    gsap.registerPlugin(Draggable);
    gsap.registerPlugin(InertiaPlugin);

    const windowElements = document.querySelectorAll(".window");

    windowElements.forEach((windowElement) => {
      const name = windowElement.getAttribute("data-name");

      Draggable.create(windowElement, {
        inertia: true,
        bounds: windowElement.parentElement,
        trigger: windowElement.querySelector("header"),
        onClick: (ev) => {
          document.body.setAttribute("data-focus-window", name || "");
        },
      });

      windowElement
        .querySelector(".maximize-button")
        ?.addEventListener("click", () => {
          gsap.to(windowElement, {
            duration: 0.5,
            transform: "translate(-50%, -50%)",
            ease: "power2.out",
          });
        });

      windowElement.querySelectorAll(".minimize-button").forEach((btn) => {
        btn.addEventListener("click", () => {
          name && minimize(name);
        });
      });
    });

    document.addEventListener(
      "open-app",
      (
        event: Event & {
          detail: {
            name: string;
          };
        }
      ) => {
        const windowElement = document.querySelector(
          `.window[data-name="${event.detail.name}"]`
        );

        const alreadyOpen =
          windowElement?.getAttribute("data-active") === "true";

        document.body.setAttribute("data-focus-window", event.detail.name);
        document.body.querySelectorAll(".window").forEach((el) => {
          if (el.getAttribute("data-focus") !== "false") {
            el.setAttribute("data-focus", "false");
          }
        });
        windowElement?.setAttribute("data-focus", "true");

        if (alreadyOpen) {
          return;
        }

        windowElement?.setAttribute("data-active", "true");

        gsap.to(windowElement, {
          duration: 0.5,
          scale: 1,
          opacity: 1,
          y: "0%",
          ease: "power2.out",
        });

        document
          .querySelector(`.dock-item[data-name="${event.detail.name}"]`)
          ?.setAttribute("data-active", "true");

        const activeWindows = [
          ...(document.body
            .getAttribute("data-active-windows")
            ?.split(",")
            .filter((name) => name !== event.detail.name && name !== "") || []),
          event.detail.name,
        ];

        document.body.setAttribute(
          "data-active-windows",
          activeWindows.join(",")
        );
        document
          .querySelector(`.window[data-name="${event.detail.name}"]`)
          ?.focus();
      }
    );

    document.addEventListener(
      "minimize-app",
      (
        event: Event & {
          detail: {
            name: string;
          };
        }
      ) => {
        document
          .querySelector(`.window[data-name="${event.detail.name}"]`)
          ?.setAttribute("data-active", "false");

        gsap.to(
          document.querySelector(`.window[data-name="${event.detail.name}"]`),
          {
            duration: 0.5,
            scale: 0,
            opacity: 0,
            y: "100%",
            ease: "power2.out",
          }
        );
      }
    );

    // open default apps
    open("finder");
  });
</script>

<Menubar />
<main>
  {@render children()}
</main>
<Dock />
