## ZenTube - Chrome Extension for YouTube

ZenTube helps you curate YouTube for focus and intentional viewing. It lets you quickly hide Shorts, turn off comments, suppress “Up next” recommendations, and jump straight to your Subscriptions feed — all controllable from a polished popup UI. Changes apply live across open YouTube tabs and persist using Chrome storage.

This project is built with Vite + React and ships as a Manifest V3 Chrome extension.

## Contents
- Overview
- Features
- How It Works
- Installation
- Development
- Building
- Usage
- Permissions
- Settings
- Privacy & Data
- Troubleshooting
- FAQ
- Contributing
- File Structure
- License

## Overview
- Purpose: Reduce distractions on YouTube and support deep work.
- Scope: Runs on `https://*.youtube.com/*` via a content script.
- Tech: React popup (`index.html` + `src/App.tsx`), MV3 `manifest.json`, `chrome.storage` for settings, DOM mutations via a content script (`src/content.ts`).

## Features
- Hide Shorts: Removes Shorts shelves from the homepage/feed.
- Hide Recommended: Hides the “Up next”/secondary recommendations pane on watch pages.
- Subscriptions Only: Redirects you to `https://www.youtube.com/feed/subscriptions` when enabled.
- Turn Off Comments: Hides the comment section on all videos.
- Live Application: Uses a MutationObserver to re-apply settings as YouTube loads dynamic content.
- Persisted Settings: Uses `chrome.storage.local` so your choices stick across sessions.

## How It Works
- Popup UI: `src/App.tsx` renders a small control panel with toggles. Each toggle updates `chrome.storage.local` with the relevant setting key.
- Content Script: `src/content.ts` runs on YouTube pages, reads settings once on load, and listens to `chrome.storage.onChanged` to apply changes live.
- DOM Manipulation: Hides elements by setting `style.display` to `none` on known containers like `ytd-rich-section-renderer` (Shorts), `ytd-comments` (comments), and recommendation panes (`#secondary`, `.ytd-watch-next-secondary-results-renderer`).
- Subscriptions Redirect: If `subsOnly` is enabled and you’re not on subscriptions, it redirects to the subscriptions feed.
- MutationObserver: Re-applies `applySettings()` whenever the DOM changes so new content stays aligned with settings.

## Installation
- Prerequisites: Node.js 18+ and a Chromium-based browser (Chrome).
- Install dependencies:

```bash
npm install
```

- Development server:

```bash
npm run dev
```

- Load the extension in Chrome:
- Run `npm run build` to produce a distribution bundle.
- Open Chrome → `chrome://extensions` → enable “Developer mode”.
- Click “Load unpacked” and select the build output directory (typically `dist/`).
- The extension should appear as “ZenTube”.

## Development
- Start Vite dev server:

```bash
npm run dev
```

- Lint:

```bash
npm run lint
```

- Preview production build locally:

```bash
npm run preview
```

## Building
- Create a production build:

```bash
npm run build
```

- Output: Vite generates the extension bundle (MV3) ready to be loaded via “Load unpacked”. Ensure `manifest.json` and assets are included in the output.

## Usage
- Click the ZenTube icon in the Chrome toolbar to open the popup.
- Toggle features:
- Hide Shorts: removes the Shorts shelves from feeds.
- Hide Recommended: hides the secondary recommendations on watch pages.
- Subscriptions only: routes you to your subscriptions feed.
- Turn off Comments: hides comments on all videos.
- Notes:
- Settings apply to open YouTube tabs. If something looks off, refresh the tab.
- When enabling “Hide Recommended”, an alert may inform you that Theater Mode can improve the experience when the sidebar is hidden.

## Permissions
- `storage`: Used to persist your toggle states.
- `content_scripts`: Runs only on `https://*.youtube.com/*` URLs.

## Settings
- Keys stored in `chrome.storage.local`:
- `hideShorts`: boolean
- `hideRecommended`: boolean
- `subsOnly`: boolean
- `turnOffComments`: boolean
- Content script also tracks a temporary `focusMode` flag internally to gate application (currently defaulted off). The UI does not expose a global focus toggle; features apply individually.

## Privacy & Data
- No tracking or analytics.
- No network requests are made by the extension.
- Settings are stored locally via `chrome.storage.local` on your machine.

## Troubleshooting
- Elements not hiding consistently:
- Refresh the tab after toggling.
- Ensure the URL matches `https://*.youtube.com/*`.
- YouTube’s UI can change; if selectors break, update `src/content.ts`.
- “Hide Recommended” not working:
- Confirm you’re on a watch page (video loaded) where `#secondary` exists.
- Switch to Theater Mode for a better layout when the sidebar is hidden.
- Subscriptions Only redirect loops:
- The script only redirects if you’re not on the subscriptions feed; it shouldn’t loop. If it does, check for other extensions interfering with navigation.

## FAQ
- Does this remove thumbnails or titles entirely?
- No. It hides specific sections (Shorts, comments, recommendation sidebar). Regular feed/video content remains.
- Can I use this on mobile?
- No. Chrome extensions run on desktop Chromium browsers.
- Will this break YouTube features?
- Hiding comments and recommendations removes parts of the UI. If a page behaves unexpectedly, toggle features off and refresh.

## Contributing
- Issues and PRs welcome. Suggested improvements:
- Add a global “Focus Mode” master toggle in the popup.
- Settings sync via `chrome.storage.sync` (optional).
- Additional filters (homepage recommendations, shorts in channel pages).
- To contribute:
- Fork and clone.
- Create a feature branch.
- Run `npm run dev` and test changes.
- Open a PR with a clear description and screenshots if UI changes.

## File Structure
- `manifest.json`: MV3 manifest, icons, permissions, content scripts.
- `index.html`: Popup entry, mounts React app.
- `src/App.tsx`: Popup UI with toggles and calls to `chrome.storage.local`.
- `src/content.ts`: Content script applying settings to YouTube DOM.
- `vite.config.ts`: Vite config for building MV3.
- `package.json`: Scripts and dependencies.
- `icons/`: Extension icons used by Chrome.
