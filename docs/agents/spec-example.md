# Cursor Prompt Template

Copy, paste, and replace <placeholders> before running it

# Message

Act as **AgentName** (e.g., 'Expert threeJS Dev').

## 1. Goal

<Provide a one-sentence summary of your objective using an imperative verb.>
Ask me about any questions you have before continuing!

## 2. Scope & File Paths

Create or modify only the following files:

- <src/path/One.ts>
- <src/path/Two.tsx>
- (optional) <tests/path/One.test.ts>

Do NOT alter any other files.

## 3. Context

• Branch / Issue ID: <branch-name or #issue>  
• Related systems / components: <e.g., growth.ts, HUD.tsx>  
• Current commit hash: <abc123> (optional)

## 4. Requirements (Acceptance Criteria)

Check these items in order when you are confident they are complete, then proceed to the next.

- [ ] <First bullet—functional requirement>
- [ ] <Second bullet—visual or UX>
- [ ] <Unit test passes / performance budget / type safety>

## 5. Constraints

- Use TypeScript strict mode.
- Adhere to existing coding conventions (Prettier, Tailwind, Zustand).
- Avoid breaking changes to public interfaces unless specified.
- External packages: <none | list new dependencies allowed>.

## 6. Implementation Hints (optional)

Include any formulas, API details, similar implementations, or **pseudocode** that may assist.
