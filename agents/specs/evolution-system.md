# Evolution System

**review /agents/agents.md before beginning, and make sure to ask any questions you have throughout the process.**

# Message

Act as an experienced vite react developer working on a clicker game. You are a seasoned vet that doesn't make bad decisions for future tech debt. IQ at least 500!!!

## 1. Goal

Implement a level progression system where players "evolve" to new levels when they reach certain biomass milestones. Each level represents a different scale of existence, from microscopic to cosmic.

## 2. Scope & File Paths

Create or modify the following files:

- `/src/engine/Levels.ts` (new file)
- `/src/engine/mapState.ts`
- `/src/engine/game.ts`
- `/src/components/HUD/EvolutionPanel.tsx` (new file)
- `/src/components/HUD/GameHUD.tsx`
- `/agents/specs/upgrades-generators.md` (reference for new content)

## 3. Context

The game currently has a single level system. We need to implement a progression system that unlocks new levels based on biomass thresholds, with each level having unique visual themes, available generators/upgrades, and food types.

## 4. Requirements (Acceptance Criteria)

### Level Progression System

- [ ] 7 levels total: Intro, Microscopic, Petri Dish, Lab, City, Earth, Solar System
- [ ] Each level has a biomass threshold for evolution
- [ ] Biomass representation changes per level based on scale (scientific notation, decimals, whole numbers, "-illions")
- [ ] Player keeps all generators and upgrades when evolving
- [ ] Biomass carries over to new level (no spending required)
- [ ] Generators continue producing at same rate in new levels

### Level Data Structure

- [ ] Biomass threshold for evolution
- [ ] Background image/theme
- [ ] Available generators/upgrades (level-gated)
- [ ] Food types and spawn rates
- [ ] Visual theme/colors
- [ ] Biomass display format (scientific notation, decimals, etc.)

### UI Components

- [ ] Evolution Panel in HUD showing:
  - Current level name
  - Biomass required for next evolution
  - Evolve button (enabled when threshold met)
- [ ] Integration with existing GameHUD layout
- [ ] Clear visual feedback for evolution availability

### Game Engine Integration

- [ ] Level state management in mapState
- [ ] Evolution mechanics in game engine
- [ ] Level-specific content unlocking
- [ ] Smooth transitions between levels

## 5. Biomass Thresholds & Display Format

### Proposed Scale (flexible):

1. **Intro**: 0 → 1 (standard format)
2. **Microscopic**: 1 → 1.000e-6 (scientific notation, 3 decimal places)
3. **Petri Dish**: 1.000e-6 → 10.000 (3 decimal places, no scientific notation)
4. **Lab**: 10 → 10,000,000 (whole numbers, commas)
5. **City**: 10,000,000 → 500,000,000,000 (whole numbers, commas)
6. **Earth**: 5.000e11 → 2.500e17 (scientific notation)
7. **Solar System**: 2.500e17+ (scientific notation or progressive "-illions", e.g. quintillion, sextillion)

## 6. Level-Specific Content

### Generators & Upgrades

- New generators/upgrades unlock at specific levels
- Content designed to be relevant to current level theme
- Balance ensures level-appropriate progression
- Reference `/agents/specs/upgrades-generators.md` for specific content

### Food Types

- Microscopic: Amoeba, bacteria
- Petri Dish: Nutrients, organic matter
- Lab: Chemicals, compounds
- City: People, vehicles
- Earth: Cities, countries
- Solar System: Planets, asteroids, galaxies

## 7. Implementation Plan

### Phase 1: Core Level System

1. Create `Levels.ts` with level data structure
2. Update `mapState.ts` for level tracking
3. Update `game.ts` for evolution mechanics

### Phase 2: UI Components

4. Create `EvolutionPanel.tsx`
5. Update `GameHUD.tsx` for integration

### Phase 3: Level-Specific Content

6. Add level-gated generators/upgrades
7. Implement level-specific food types

### Phase 4: Integration & Polish

8. Connect all systems
9. Test progression end-to-end

## 8. Constraints

- Use TypeScript strict mode
- Adhere to existing coding conventions (Prettier, Tailwind, Zustand)
- Maintain existing game mechanics and UI layout
- No breaking changes to public interfaces unless specified
- Focus on core functionality first, polish features later

## 9. Questions & Clarifications

### Answered:

1. **Biomass thresholds**: Flexible scale with level-appropriate representation
2. **Level persistence**: Browser session only, no save/load required
3. **Evolution mechanics**: Keep generators/upgrades, carry over biomass, no spending required
4. **Level-specific content**: New generators/upgrades unlock per level, food types change
5. **UI placement**: New panel in HUD, separate from existing components
6. **Level data structure**: Comprehensive properties including thresholds, themes, content

### Implementation Notes:

- Biomass scaling should be exponential to match generator progression
- Focus on essential features first, sound/visual effects are lower priority
- Shop UI improvements (smaller icons, hover details) are stretch goals
- Level transitions will be handled by teammates, focus on game engine mechanics
