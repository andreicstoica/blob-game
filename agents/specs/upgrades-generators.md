# Level-Specific Generators & Upgrades

**review /agents/agents.md before beginning, and make sure to ask any questions you have throughout the process.**

# Message

Act as an experienced vite react developer working on a clicker game. You are a seasoned vet that doesn't make bad decisions for future tech debt. IQ at least 500!!!

## 1. Goal

Replace the existing generators and upgrades with level-specific content that unlocks progressively as players evolve through different scales of existence. Each level should have unique generators and upgrades that are thematically appropriate and mechanically balanced.

## 2. Scope & File Paths

Create or modify the following files:

- `/src/engine/content.ts` - Replace existing generators and upgrades
- `/src/engine/Levels.ts` - Update level data to include available generators/upgrades
- `/src/components/HUD/Shop.tsx` - Update to handle level-gated content display

## 3. Context

The current game has basic generators and upgrades that are available from the start. We need to replace these with a progression system where new content unlocks at each evolution level, creating a sense of advancement and thematic coherence.

## 4. Requirements (Acceptance Criteria)

### Level-Specific Content System

- [ ] Replace all existing generators with level-appropriate alternatives
- [ ] Replace all existing upgrades with level-appropriate alternatives
- [ ] Content unlocks based on current evolution level
- [ ] Each level has 4-5 generators and 4-5 upgrades
- [ ] Generators and upgrades are thematically consistent with level
- [ ] Balanced progression that matches biomass thresholds

### Content Requirements by Level

#### 1️⃣ Intro Level

- [ ] **Generators**: Basic starter generators (1-2)
- [ ] **Upgrades**: Basic efficiency upgrades (1-2)
- [ ] **Theme**: Simple, tutorial-friendly content

#### 2️⃣ Microscopic Level

- [ ] **Generators**:
  - Microscope Cloner — Uses lab-grade optics to split slimes
  - Petri Dish Breeder — Controlled medium to grow colonies
  - Agar Farm — Rich nutrient beds for mass production
- [ ] **Upgrades**:
  - Enhanced Microscope Optics — Boost cloning yield
  - Sterile Technique Mastery — Fewer slime losses to contamination
  - Rapid Binary Fission — Doubles cell division speed

#### 3️⃣ Petri Dish Level

- [ ] **Generators**:
  - Colony Expander — Increases surface area for growth
  - Spore Launcher — Shoots spores to seed new dishes
  - Contaminant Converter — Turns bacterial rivals into slime fuel
- [ ] **Upgrades**:
  - Temperature Control Module — Optimal growth rates
  - Nutrient-Enriched Agar — Doubles slime output
  - Antibiotic Resistance — Reduces losses to rival microbes

#### 4️⃣ Lab Level

- [ ] **Generators**:
  - Centrifuge Sorter — Isolates the strongest slime cells
  - Bioreactor Tank — Massive controlled slime growth
  - Autoclave Recycler — Recycles lab waste into slime food
- [ ] **Upgrades**:
  - Lab Assistant Automation — Reduces downtime
  - Sterile Workflow — Improves all production by 25%
  - Precision Pipetting — Higher yield per batch

#### 5️⃣ City Level

- [ ] **Generators**:
  - Humanoid Slimes — Shape-shifting infiltrators
  - Sewer Colonies — Hidden mass production underground
  - Subway Spreaders — Transport slimes city-wide
- [ ] **Upgrades**:
  - Mimicry Training — Humanoid slimes blend in better, more efficient
  - Urban Camouflage — Avoids detection, increases output
  - Subway Expansion Plan — Faster city-wide spread

#### 6️⃣ Earth Level

- [ ] **Generators**:
  - Cargo Ship Infestors — Global shipping spread
  - Airplane Spore Units — Air travel contamination
  - Forest Hive Colonies — Rural mass production
- [ ] **Upgrades**:
  - Intercontinental Mutation — Adapts to all climates
  - Stealth Mode — Slimes avoid military detection
  - Accelerated Evolution — Huge output boost

#### 7️⃣ Solar System Level

- [ ] **Generators**:
  - Terraforming Ooze — Prepares planets for slime colonization
  - Asteroid Seeder — Fires slime pods across space
  - Starship Incubator — Grows slime on interstellar ships
- [ ] **Upgrades**:
  - Cosmic Radiation Tolerance — Survives anywhere
  - Faster-Than-Light Spread — Instant interplanetary contamination
  - Self-Replicating Probes — Automates seeding new worlds

### Technical Requirements

- [ ] Update `content.ts` with new generator and upgrade definitions
- [ ] Update `Levels.ts` to specify available content per level
- [ ] Update `Shop.tsx` to only show available content for current level
- [ ] Maintain backward compatibility with existing game state
- [ ] Balance costs and effects to match biomass thresholds

## 5. Implementation Plan

### Phase 1: Content Definition

1. Define all new generators with appropriate costs and effects
2. Define all new upgrades with appropriate costs and effects
3. Update `content.ts` to replace existing content

### Phase 2: Level Integration

4. Update `Levels.ts` to specify available content per level
5. Update level data structure to include content lists

### Phase 3: UI Updates

6. Update `Shop.tsx` to filter content by current level
7. Add visual indicators for locked/unavailable content

### Phase 4: Testing & Balance

8. Test progression through all levels
9. Balance costs and effects for smooth progression

## 6. Content Specifications

### Generator Template

```typescript
{
  id: 'generator-id',
  name: 'Generator Name',
  baseCost: number,
  description: 'What this generator does',
  baseEffect: number,
  costMultiplier: 1.15,
  levelRequired: 'level-id' // Which level unlocks this
}
```

### Upgrade Template

```typescript
{
  id: 'upgrade-id',
  name: 'Upgrade Name',
  cost: number,
  description: 'What this upgrade does',
  effect: number,
  type: 'growth' | 'click' | 'blob',
  levelRequired: 'level-id' // Which level unlocks this
}
```

## 7. Constraints

- Use TypeScript strict mode
- Adhere to existing coding conventions (Prettier, Tailwind, Zustand)
- Maintain existing game mechanics and UI layout
- No breaking changes to public interfaces unless specified
- Focus on core functionality first, polish features later
- Balance for exponential growth progression

## 8. Notes

- Generators should have exponentially increasing costs to match biomass thresholds
- Upgrades should provide meaningful bonuses that scale with generator levels
- Content should feel thematically appropriate to each level
- Consider the progression from microscopic to cosmic scale
- Maintain game balance across all levels
