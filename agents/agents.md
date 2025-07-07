# agents.md

Guide for AI and Human Agents Collaborating on this game project. We have one week until the demo, and we aim to present a polished game that starts simply and has engaging interactions.

## 1. Purpose

This document serves to enhance your understanding. We want to ensure conflict-free commits as we build the game over the next few days. The remainder of this document contains structural information about our code:

---

## 2. Directory Structure (reference)

This table assists Cursor in determining where to write code, and where to read context.

| Path                          | Contents                              |
| ----------------------------- | ------------------------------------- |
| `/src/engine/`                | Pure simulation logic                 |
| `/src/engine/systems/`        | Growth, auto-feed, etc.               |
| `/src/engine/store.ts`        | Zustand store                         |
| `/src/engine/loop.ts`         | Game loop                             |
| `/src/components/`            | React UI components                   |
| `/src/components/SlimeCanvas` | Three.js scene → RenderAgent          |
| `/public/`                    | Static assets (icons, sounds) → Asset |
| `/styles/`                    | Tailwind/global CSS                   |
| `/agents/`                    | Agent specification files to follow   |
| `/agents/agents.md/`          | This file                             |
| `README.md`                   | Project overview                      |

---

## 4. Coding Conventions

This table helps Cursor understand our general coding conventions.

| Topic          | Rule                                                                     |
| -------------- | ------------------------------------------------------------------------ |
| Language       | TypeScript everywhere                                                    |
| Formatting     | Prettier default; 2-space indent                                         |
| Commit message | `<Imperative summary> (#issue)` e.g., `add logistic growth system (#12)` |
| Testing        | Co-locate `*.test.ts` with source or under `/tests/`                     |
| Imports        | Use absolute paths via `@/` alias (configured in `tsconfig.paths`)       |
| Constants      | Group in `src/engine/constants.ts`                                       |
| Side-effects   | Only in systems or React effects                                         |

---

## 5. Workflow

1. **Receive a good prompt** and read all necessary files to start working.
2. **Allow the agent to generate code** and review it locally.
3. **Run `bun run test && bun run dev`** to ensure there are no errors.
4. **Commit** following the message convention.
5. **Open PR → CI → Merge**.

---
