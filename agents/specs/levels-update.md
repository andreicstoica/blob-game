# Levels Update

**review /agents/agents.md before beginning, and make sure to ask any questions you have throughout the process.**

# Message

Act as an experienced vite react developer working on a clicker game. You are a seasoned vet that doesn't make bad decisions for future tech debt. IQ at least 500!!!

## 1. Goal

Update the map component to have more/different levels. we want the backgrounds to indicate that they are indeed that level (like the PetriLayer right now has a small circle that hints at a petri dish.) No need to go too crazy on the styling for now, we will update styling later. Don't update the

## 2. Scope & File Paths

Create or modify only the following files:

- /src/components/Map (and all files inside, like /layers)
- /src/components/CycleMaps

Do NOT alter any other files.

## 3. Context

The game engine (/src/engine) will handle the swapping of levels when certain criteria in the game are met. please architect the map component to allow for this in /App.tsx (i believe it is set up this way already)

## 4. Requirements (Acceptance Criteria)

Check these items in order when you are confident they are complete, then proceed to the next.

- [ ] Rename the /layers folder to be levels
- [ ] change the existing levels, and add more, to match this structure:

1. Intro
2. Microscope
3. Petri
4. Lab
5. City
6. Earth
7. Sun solar system

- [ ] make sure none of the other game logic is changed, or how map is rendered in /App.tsx
- [ ] make sure that all other elements that display (like nutrients, the blob, HUD, etc.) have good contrast, and that their placement logic remains the same. for example, if we resize the screen, we want the blobs to remain in the same place, not move with the window resizing.

## 5. Constraints

- Use TypeScript strict mode.
- Adhere to existing coding conventions (Prettier, Tailwind, Zustand).
- Avoid breaking changes to public interfaces unless specified.

## 6. Implementation Hints (optional)

- I suggest you use SVG to make simple themed backgrounds for each level for now.
