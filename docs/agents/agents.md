# agents.md

Guide for AI and Human Agents Collaborating on this game project. We have one week until the demo, and we aim to present a polished game that starts simply and has engaging interactions.

## 1. Purpose

This document serves to enhance your understanding. We want to ensure conflict-free commits as we build the game over the next few days. The remainder of this document contains structural information about our code:

---

## 2. Directory Structure (reference)

This table assists Cursor in determining where to write code, and where to read context.

| Path                          | Contents                            |
| ----------------------------- | ----------------------------------- |
| `/src/engine/`                | Pure simulation logic               |
| `/src/engine/game.ts`         | Main game engine                    |
| `/src/engine/Levels.ts`       | Level definitions                   |
| `/src/engine/mapState.ts`     | Map state management                |
| `/src/engine/content.ts`      | Game content/data                   |
| `/src/components/`            | React UI components                 |
| `/src/components/Blob/`       | Blob-related components             |
| `/src/components/Map/`        | Map and level components            |
| `/src/components/HUD/`        | Heads-up display components         |
| `/src/components/Animations/` | Animation components                |
| `/src/components/Food/`       | Food/nutrition components           |
| `/src/hooks/`                 | Custom React hooks                  |
| `/src/styles/`                | Tailwind/global CSS                 |
| `/public/`                    | Static assets (icons, sounds)       |
| `/public/assets/`             | Game assets (images, textures)      |
| `/agents/`                    | Agent specification files to follow |
| `/agents/specs/`              | Feature specifications              |
| `README.md`                   | Project overview                    |

---

## 4. Coding Conventions

This table helps Cursor understand our general coding conventions.

| Topic          | Rule                                                               |
| -------------- | ------------------------------------------------------------------ |
| Language       | TypeScript everywhere                                              |
| Formatting     | Prettier default; 2-space indent                                   |
| Commit message | `<Imperative summary>` e.g., `add logistic growth system`          |
| Testing        | Co-locate `*.test.ts` with source or under `/tests/`               |
| Imports        | Use absolute paths via `@/` alias (configured in `tsconfig.paths`) |
| Constants      | Group in `src/engine/constants.ts`                                 |
| Side-effects   | Only in systems or React effects                                   |

---

## 5. Workflow

1. **Receive a good prompt** and read all necessary files to start working.
2. **Allow the agent to generate code** and review it locally.
3. **Commit** following the message convention.

---
