export interface App {
  title: string;
  name: string;
  icon: string;
}

import finderImage from "$/assets/finder.png";
import musicImage from "$/assets/music.png";
import settingsImage from "$/assets/settings.png";
import xcodeImage from "$/assets/xcode.png";

export const apps: App[] = [
  {
    title: "Finder",
    name: "finder",
    icon: finderImage,
  },
  {
    title: "Music",
    name: "music",
    icon: musicImage,
  },
  {
    title: "Settings",
    name: "settings",
    icon: settingsImage,
  },
  {
    title: "Xcode",
    name: "xcode",
    icon: xcodeImage,
  },
];

export function open(name: string) {
  const event = new CustomEvent("open-app", {
    detail: {
      name,
    },
  });

  document.dispatchEvent(event);
}

export function minimize(name: string) {
  const event = new CustomEvent("minimize-app", {
    detail: {
      name,
    },
  });

  document.dispatchEvent(event);
}
