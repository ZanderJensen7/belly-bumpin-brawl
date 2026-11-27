# Belly Bumpin' Brawl: notes for Claude

Two friends build this game together, and **neither uses git by hand**. They talk to Claude in the Claude Code app, and Claude does all the git and GitHub work. This file is the shared memory between their sessions, so follow it every time.

Live game: https://zanderjensen7.github.io/belly-bumpin-brawl/ (GitHub Pages, served from the root of `main`).

**Nobody reviews PRs by hand.** The two of them judge changes by playing the live game. So Claude carries every change all the way to `main` without waiting for a human approval.

## "What's changed since my last session?"

When someone asks this, or something like "what did my friend do?":
1. Sync (`git pull`).
2. Find the newest `CHANGELOG.md` entry asked by that person. Everything above it is new to them.
3. Cross-check with `git log` since that person's last change, for anything missing from the changelog.
4. Reply with a short plain-language summary grouped by who asked. Give the current build number, which shows bottom-right in the game. Mention anything half-finished, such as open PRs or open issues.

If you don't know who you're talking to, ask once at the start of the session ("Zander or <friend>?"). Use that name on the changelog entries.

## The workflow (do this every session)

1. **Sync first.** Before reading or changing code, run `git fetch origin && git checkout main && git pull`. The whole game is one big file, so working from an old copy is how conflicts happen.
2. **See what the other person is doing.** Look at the open pull requests and the open GitHub Issues. The issues are the shared to-do list. If the task overlaps with someone's open PR, say so before starting.
3. **Branch.** Create a branch named `<who>/<short-topic>` (for example `zander/seesaw-tweak`). Ask who you're working with if you don't know.
4. **Keep changes small.** Make one feature or fix per branch. Small PRs merge cleanly, and big ones collide in the single source file.
5. **Edit only `src/src.html`** (plus `src/build.js` if needed).
   - **Never edit or commit `index.html` or `src/buildnum.txt`.** The GitHub Action builds and publishes them.
   - `src/last-call-brawl.html` is local build output and is gitignored.
6. **Check it builds:** run `node src/build.js && node src/check.js`. If the user wants to see it, open `src/last-call-brawl.html?local` in a browser and take a screenshot.
7. **Add a `CHANGELOG.md` entry** at the top in the same branch. Include today's date, who asked, `(build ?)`, and plain bullets a player would understand. This is required for every change.
8. **Open a PR** into `main`.
   - Give it a plain-English title and a short description of what changed.
   - Add `Closes #N` if it finishes an issue.
   - The PR check builds the game, makes sure it parses, and attaches the built file as a downloadable artifact named `game-build`.
9. **Merge it yourself once the check is green.** Don't wait for a human review.
   - Rebase on the latest `main` first if `main` moved, then squash merge.
   - If the check fails, fix it. Don't merge a red PR.
   - Within about 2 minutes the Action bumps the build number, fills it into the changelog, rebuilds `index.html` and publishes it.
   - Tell the user which build to look for. It shows bottom-right in the game as "build N". Hard refresh with Ctrl+Shift+R.
10. **Tiny fixes** (a typo, a one-line number tweak) may go straight to `main` instead. Sync right before pushing, include the changelog entry, and never commit `index.html`.

**Conflicts:**
- Before opening a PR and before merging, rebase on the latest `main`.
- If both people changed the same lines, keep both intents when they're compatible. Otherwise ask the user which version wins.
- Never force-push `main`.

**Leaving notes for the other person:**
- Use GitHub Issues: make a new issue or comment on an existing one.
- Put lasting rules in this file in the same PR as the change that needs them.
- Don't keep important notes anywhere else. The other person's Claude can't see your session.

## How the code is laid out

- `src/src.html` is the whole game: HTML, CSS and JS in one file, written in dense, mostly one-line JS. Follow the existing style. Use grep to find a function by name rather than reading the whole file.
- `src/build.js` inlines `src/peerjs.min.js` at `/*__PEERJS__*/` and the build number at `__BUILD__`.
- `src/check.js` makes sure every inline script in the built file parses.
- `b25.html` is an old build kept for A/B testing. Leave it alone.

**Main pieces of the code:**
- **Host-authoritative networking.** One player's browser hosts and runs the simulation (`simStep`) at 60 Hz. Clients send inputs and receive snapshots about 30 times a second.
  - `snapshot0()` builds each snapshot.
  - Players are packed as arrays in the field order of `PK`.
  - Events go through `ev(type, fields)` and are handled in `onEv`. **The field name `k` is reserved for the event type**, so never use `k` as a field in an event payload.
- **`PROTO`.** Bump this number whenever you change network messages, the snapshot format or the `PK` fields. Players on mismatched builds then get told to refresh.
- **Connections.** Players connect directly with WebRTC through PeerJS. If that fails, the game falls back to a relay: a built-in MQTT-over-WebSocket client that uses free public brokers (emqx, hivemq, eclipse, mosquitto).
  - The badge in the bottom-right shows ping and the connection path.
  - The leaderboard (`lcb1/lb/<uid>`, retained messages), the Hub (`lcb1/hub/...`) and the room browser (`lcb1/rooms/...`) also run over MQTT. There's no server of our own.
- **Couch play.** Extra controllers press START to join as local guests.
  - Player ids are `<ownerId>~<slot>`.
  - Controller ownership lives in `PADS`, and guest state in `LOC`.
  - Gamepad menu navigation is in `gpNav`.
- **Maps.** The `MAPS` object holds shapes (`c` circle, `r`/`s` rect) plus optional `belts`, `ice`/`grip` and `holes`. Textures are drawn in `getTex(id)`, and lobby map buttons live in `#segP`. The camera auto-fits each map (`fitCam`).
- **Saved data.** Settings and progress live in localStorage under `lcb_*` keys, read and written through `store.get/set`. Stats live in `lcb_stats`.
- **URL test flags.**
  - `?local` lets two tabs on one machine play together.
  - `?forcerelay` and `?nortc` force the relay connection path.
  - `?deep`, `?donger`, `?hand`, `?disco`, `?hydro` force rare events.
  - `?touch` shows the mobile controls.

## Zander's design rules

- **Keep it TowerFall-simple:** a few intuitive rules, with lots of room for skill and counterplay. Don't stack extra rule layers.
- **The core is Space** (hold to charge, release to dash-bump) **plus Shift** (parry).
- Everyone starts each life with **one drink**: F chugs it, F again throws it. Extra throwables come only from mystery crates. **There's no baseline gun.**
- **No aim previews or landing lines.** Reading a dash is part of the skill. A dotted reach line was removed in build 65 for this reason.
- Perks are mechanic or meme effects (Martyrdom, Uno Reverse...), never "+5% stat" bumps.
- In-game text is short and punchy. Avoid walls of text during play.
- Special and hidden achievements always give a cosmetic reward.
- The direction is a friend-group party game, both online and couch. Joining has to just work.
