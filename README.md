<div align="center">
<div><img src="https://github.com/kkrishguptaa/dockyard/raw/main/src/assets/icon.svg" alt="Dockyard logo" width="96" height="96"></div>
<h1>Dockyard</h1>
<p>The Yard where YSWS Dock.</p>
</div>

## Features

- [x] Finder - Find YSWS programs.
- [x] Timer - A countdown to the end of YSWS.
- [x] Music - House Music Playlist by [Ganesh](https://github.com/Decrescent398).
- [x] XCode - Forms to add/edit YSWS programs.

## Components

### The Dockyard

It is the Web App that runs on the browser. It is a single-page application (SPA) built with SvelteKit.

![Preview of Dockyard](https://github.com/user-attachments/assets/ba232b70-f9c1-4eec-8f2f-b835c69f850e)

It is live and accessible with Vercel at [dockyard.krishg.com](https://dockyard.krishg.com).

### The API

It is a bunch of static JSON files that are used to store the data of the YSWS programs. It can sourced by Raw GitHub File links in the `api` folder.

It is also deployed to GitHub Pages at [dockyard-api.krishg.com](https://dockyard-api.krishg.com).

The endpoints are:

```md
- ALL YSWS Programs: https://dockyard-api.krishg.com/data.json
- Singular YSWS Program: https://dockyard-api.krishg.com/data/{id}.json
```

### The GitHub Automator

It is a GitHub Action that runs whenever an issue is created with `gh-automator` label. The issue is meant to be created using Dockyard's XCode app. When the issue is approved, the GitHub Action will create a new file in the `api` folder with the data of the YSWS program. A PR will be created and merged automatically.

## Development

To run Dockyard, we use `bun` as the package manager and task runner. If you don't have `bun` installed, you can install it from [here](https://bun.sh/docs/installation).

To run the Dockyard locally, follow these steps:

1. Clone the repository:

   ```bash
   git clone https://github.com/kkrishguptaa/dockyard
   cd dockyard
   ```

1. Install the dependencies:

   ```bash
   bun install
   ```

1. Start the development server:

   ```bash
   bun run dev
   ```
