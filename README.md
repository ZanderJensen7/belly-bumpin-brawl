# Belly Bumpin' Brawl 🍺

A wobbly, drunk-friendly party brawler for 2–6 friends online. Belly-bump each other off a floating bar table. Winners get drunker.

**Play:** https://zanderjensen7.github.io/belly-bumpin-brawl/

- Host a room, share the 4-letter code, and friends join from their browsers. No installs.
- Modes: Last One Standing, Tag Team 2v2, Happy Hour, King of the Coaster
- Maps: Round Table, Bar Counter, Beer Pong Table, Coaster Hop, The Donut
- Corks for everyone: hold F to aim, release to fire, pick them back up. Belly Parry (Shift) to deflect and catch, or dodge with a direction.
- Mystery crates (more corks, Belly Armor, Liquid Courage, Big Gulp), glass railings, 12 chaos rules, drink cards (optional)

## Working on it

We build this by talking to Claude in the Claude Code app, not with git by hand. Claude reads [CLAUDE.md](CLAUDE.md) for the workflow: sync first, branch, open a PR, merge.

- Source is `src/src.html`. `index.html` is built and published automatically by the GitHub Action when something merges to `main`, so never edit it by hand.
- Shared to-do list: [Issues](https://github.com/ZanderJensen7/belly-bumpin-brawl/issues).
- Every PR's checks attach the built game as a downloadable `game-build` artifact, so you can try a change before merging.
