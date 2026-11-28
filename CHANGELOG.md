# Changelog

Newest first. Every change adds an entry. Format:

```
## YYYY-MM-DD · asked by <Name> (build ?)
- plain-language bullet a player would understand
```

Write `(build ?)` exactly as shown. When the change lands on `main`, the GitHub Action replaces it with the real build number.

## 2026-11-28 · asked by Curt (build ?)
- Removed the constant bar-crowd background noise and its random glass clinks. It was annoying and sounded like a whirring propeller. The crowd still reacts to big hits and knockouts, and Settings has a switch for that ("Crowd reactions").

## 2026-11-27 · asked by Curt (build 70)
- Menus tidied up: every option now lives in Settings, in three groups (Sound, Display, Controls). Mouse aim, the announcer voice, "sound when tabbed out" and "show control tips again" moved there from the title screen, Wardrobe, top bar and Esc menu. The Esc menu is now Resume, Wardrobe, My stats, Settings, then the player list and the leave buttons.
- Settings (the gear button, or the Esc menu): turn screen shake down or off, turn off flashes and disco lights, switch the bar ambience off, show a shape next to each name for colour-blind players, and rebind your keys. Mouse aim is in there too.
- When you join someone's room, your dash now launches the instant you let go, instead of waiting for the host to answer.
- Vote for the next map on the results screen (when maps are set to Random).
- Daily challenges: three a day for XP, on the title screen.
- End of match: a podium for the top three, confetti, and five new awards (Bartender's arm, Not today, Human piñata, Pacifist, Glued to the table).
- Four new emotes on keys 5–8: HA HA HA, *sob*, CHEERS! and GG.
- Sound: a quiet bar crowd in the background, the crowd reacts to big hits, near-falls and knockouts, and everyone grunts when hit.
- Dust puffs when you run, dash, skid after a hit or teeter on an edge.
- Sharing the link now shows a preview card, and the tab has an icon. Fonts are built into the game, so there's no flash of the wrong font and it works offline.
- Phones stay awake during a match.

## 2026-11-27 · asked by Zander (build 69)
- Behind the scenes: the game's code is now split into separate files by area (maps, bots, network, menus, sounds and so on), so Zander and Curt can work at the same time without stepping on each other. Nothing changes in the game.

## 2026-11-27 · asked by Zander (build 66)
- Set up the repo for two people working through Claude: a `CLAUDE.md` workflow, this changelog, and an Action that builds and publishes the game automatically.

## 2026-11-27 · asked by Zander (build 65)
- Removed the dotted dash-reach line, which made aiming too easy.

## 2026-11-27 · asked by Zander (builds 57–64)
- Couch play: extra controllers press START to join as P2–P4 (SELECT leaves). Works when hosting or joining, mixed with online players.
- Controller menus: the stick or D-pad moves a highlight, A selects, B goes back. In the lobby the host's START starts the match, and in a match START opens the menu.
- Ghosts option (lobby toggle): knocked-out players float and drop peanuts that nudge people.
- Instant replay of the last 4 seconds before the champion screen. Any button skips it.
- The secret coaster now picks a lane clear of the map, so it no longer clips through wide maps.
- Hit feel: controller rumble, camera kick in the hit direction, and a flash on big hits.
- New maps: The Keg Line (conveyor belts), The Ice Bucket (ice except grippy coasters) and The Seesaw (tilts toward the heavier end).
- The camera fits every map between the round banner and the player cards.
- UI fit pass for small windows and phones: long screens scroll instead of getting cut off.

## 2026-11-26 · asked by Zander (builds 53–56)
- Chat window in the bottom-left. Title screen layout: Host / Find game, code + Join, big Hub and Customize buttons. "Sound when tabbed out" option.
- Max level 67, with a secret way to reach 69. Level badges next to names in the lobby, Hub, chat and results.
- Quick Match fills empty rooms with bots, who swap out as people join.
- Control tips pop up during your first matches (bump, then parry after your first KO, then drink).

## 2026-11-26 · asked by Zander (builds 25–52)
- Lobby browser and Quick Match, bot difficulty, XP and unlockable cosmetics, Sore Losers mode, music.
- A relay fallback when direct connections fail, plus a ping badge, Esc menu and kick.
- Rare events (Big Donger map, Hand of God), Hydration Break, the secret Deep End mini-game, a 2-charge dash, achievements, lobby chat, a leaderboard and the Hub.
