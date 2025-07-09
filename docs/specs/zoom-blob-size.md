# Message

**review /agents/agents.md before beginning, and make sure to ask any questions you have throughout the process.**

Act as an experienced vite react developer working on a clicker game. You are a seasoned vet that doesn't make bad decisions for future tech debt. IQ at least 500!!!

## 1. Goal

Let's update the way the 'camera zooms out' when the blob is growing. We have 7 levels now, and each time the blob is 'evolved' a new level is started. I want to make sure that the camera, aka blob size in the window, 'resets' when this happens. The blob should shrink to be small again. However, the blob has a pixel size that relates to its 'biomass' which we don't want to change as that relates to the game engine logic.

Ask me about any questions you have before continuing!

## 2. Scope & File Paths

Create or modify only the following files:

- /src/Map
- /src/App.tsx

Do NOT alter any other files. If you think it is necessary to, ask me first.

## 3. Context

- /agents/agents.md

## 4. Requirements (Acceptance Criteria)

Check these items in order when you are confident they are complete, then proceed to the next.

- [ ] fix the 'camera zoom out' when the biomass of the blob grows. make it grow naturally
- [ ] reset the blob/screen dimensions ratio when the blob is evolved and a new level is set.

## 5. Constraints

- Use TypeScript strict mode.
- Adhere to existing coding conventions (Prettier, Tailwind, Zustand).
- Avoid breaking changes to public interfaces unless specified.
- External packages: <none | list new dependencies allowed>.

## 6. Implementation Hints (optional)

feel free to search the codebase to get situated.
