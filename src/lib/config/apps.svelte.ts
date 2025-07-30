import { writable } from "svelte/store";
import finderImage from "$/assets/finder.png";
import musicImage from "$/assets/music.png";
import xcodeImage from "$/assets/xcode.png";
import clockImage from "$/assets/clock.png";

export interface App {
  name: string;
  id: string;
  icon: string;
  isOpen: boolean;
  inDock: boolean;
  onDesktop: boolean;
}

type AppsState = Record<string, App>;

const initialApps: AppsState = {
  finder: {
    name: "Finder",
    id: "finder",
    icon: finderImage,
    isOpen: false,
    inDock: true,
    onDesktop: false,
  },
  music: {
    name: "Music",
    id: "music",
    icon: musicImage,
    isOpen: false,
    inDock: false,
    onDesktop: true,
  },
  clock: {
    name: "Clock",
    id: "clock",
    icon: clockImage,
    isOpen: false,
    inDock: true,
    onDesktop: false,
  },
  xcode: {
    name: "Xcode",
    id: "xcode",
    icon: xcodeImage,
    isOpen: false,
    inDock: true,
    onDesktop: false,
  },
};

export const apps = writable<AppsState>(initialApps);

export function open(id: string) {
  apps.update((current) => {
    if (current[id]) {
      current[id].isOpen = true;
    }

    return { ...current };
  });
}

export function minimize(id: string) {
  apps.update((current) => {
    if (current[id]) {
      current[id].isOpen = false;
    }

    return { ...current };
  });
}
