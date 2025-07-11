# TODOs

## Plans for Tuesday (Jul 8):

_Playable game start to finish_

- game engine
  - biomass/size
  - level scaling
  - cost scaling
  - shop scaling?
- blob animations
  - tween the growth
  - tone the ripple down as it grows
- map
  - transitions between levels
  - simple first steps for today
- HUD:
  - add visual elements for generators (ask ai to brainstorm dif names)

## Plans for Wednesday (Jul 9):

- blob:
  - interaction with food
- map:
  - better quality/zoom feature
- game scaling:
  - headlines/achievements

### Animation details

**Scene change** --> once you reach a certain size, you 'evolve' and map zooms out
when blob is in a petri dish -- it fills up the petri dish and breaks out in a planned animation (breaks out and starts next phase)

### Stretch goals

**Juice (at end)**

- blob - nutrient interactions
- temporary power-ups show up on screen (double growth, cheaper shop, etc.) - this essentially replaces the idea of different types of slimes
- animations for level changes (breakout of petri dish, etc.)
- fun text updates/quotes on level upgrades
- enemies and associated upgrades (militaries or people eating?)
- control zoom level

### Out of scope

- accounts/session management
- splitting blobs
- 3D
- pausing
- moving anything besides the blob/map

## Plans for Thursday (Jul 10):

### Main Focus

- [x] Clean up App.tsx
- [x] Generator visuals
  - [x] Only show gens from current level
  - [x] Fix floating number animations
- [x] Better intro / tutorial: 3-4 instruction bubbles
- [x] SFX for clicking blob, evolve
- [x] Clean up configuration files (bun, npm, ts.config)
- [x] Deploy

- Playtesting

### Friday goals

- [ ] Progression scaling/rebalancing - make the first 30 seconds delightful!
- [ ] achievement notifications (ai gen?) + sfx
- [ ] Improve shop UI/UX
- [ ] enemies and associated upgrades (militaries or people eating?)
- [ ] Ambient music for main menu and/or levels
- [ ] Better ending - set threshold, but can continue after cool animation
- [ ] Game name (Bloblog, Slime Sovereign, Sublobination)
- [ ] Codebase testing

### Out of scope / Tomorrow's JUICING

- Different music/SFX for each level
- Make nutrients part of gameState
- Save state persistence


## Plans for Friday (Jul 11):

Mechanics
- [ ] Space bar to click
- [ ] Rebalance progression
- [X] Fix click power
- [X] Simple headlines / lore

Aesthetics
- [X] Make nutrients smaller
- [X] UI: Evolution - break into wings on game stats, next evolution into button
- [X] UI: biomass in GameStats showing ... 
- [ ] Remove trails from bacteria
- [ ] Background music
- [ ] Simple ending trigger (main -> endless)
- [ ] Floating number animations:
  - [ ] Shop purchase (-##)
  - [ ] Growth increase (+## / sec)
  - [ ] Generators (random popups?)

Architecture
- [ ] Clean up animation loops
- [ ] Deployment
- [ ] Investigate performance issues
- [ ] Tweak intro animation

Other Ideas
- [ ] Add notification / headline when purchasing first of new generator 
    (e.g. Purchased Bioreactor! This massive labratory machine does such and such, giving you such and such domination)

### Stretch Goals

- Better shop names - more themed or more description
- UI: Upgrades like cookie clicker
- AI headlines / achievements
- Better ending
- Different music/SFX for each level
- Save state persistence

### Ben
[X] Simple click power fix
[ ] Animation tweaks
[ ] UI: biomass in GameStats showing ... 

### Andrei
[ ] Nutrient sizes and spawn rates + improved background images
[ ] UI: break Evolution into wings on game stats, next evolution into button
[ ] Simple headlines / lore



