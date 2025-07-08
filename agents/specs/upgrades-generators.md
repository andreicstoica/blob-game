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

**Important Clarifications:**

- **Generators**: All generators only increase biomass growth rate (no slime splitting or other mechanics)
- **Upgrades**: Fall into categories like click power, generator efficiency, overall growth multipliers
- **No enemies/rivals**: Remove references to contamination, rivals, or defensive mechanics
- **No downtime/recharge**: All generators work continuously
- **Keep fun descriptions**: Thematic descriptions can remain even if mechanics are simplified

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

- [ ] **Generators**: Example starter generators (1-2)
- [ ] **Upgrades**: Example efficiency and click power upgrades (1-2)
- [ ] **Theme**: Simple, tutorial-friendly content

#### 2️⃣ Microscopic Level

- [ ] **Generators**:
  - Microscope Cloner — Uses lab-grade optics to split slime particles
  - Petri Dish Breeder — Controlled medium to grow colonies faster
  - Agar Farm — Rich nutrient beds for mass production
- [ ] **Upgrades**:
  - Enhanced Microscope Optics — Boost generator yield
  - Sterile Technique Mastery — Improves all growth rates
  - Rapid Binary Fission — Doubles overall growth rate

#### 3️⃣ Petri Dish Level

- [ ] **Generators**:
  - Colony Expander — Increases surface area for growth
  - Spore Launcher — Shoots spores to seed new growth areas
  - Contaminant Converter — Converts waste into growth fuel
- [ ] **Upgrades**:
  - Temperature Control Module — Optimal growth rates
  - Nutrient-Enriched Agar — Doubles growth output
  - Antibiotic Resistance — Improves resistance to parasitic microbes, increasing growth

#### 4️⃣ Lab Level

- [ ] **Generators**:
  - Centrifuge Sorter — Isolates the most efficient growth cells
  - Bioreactor Tank — Massive controlled growth environment
  - Autoclave Recycler — Recycles lab waste into growth fuel
- [ ] **Upgrades**:
  - Lab Assistant Automation — Brainwash lab workers to improve generator efficiency
  - Sterile Workflow — Improves all production by 25%
  - Precision Pipetting — Higher yield per batch

#### 5️⃣ City Level

- [ ] **Generators**:
  - Humanoid Slimes — Shape-shifting growth infiltrators
  - Sewer Colonies — Hidden mass production underground
  - Subway Spreaders — Rapid underground transportation for city-wide growth
- [ ] **Upgrades**:
  - Mimicry Training — Humanoid slimes blend in better, becoming more powerful
  - Urban Camouflage — Improves growth efficiency
  - Subway Expansion Plan — Even faster city-wide growth

#### 6️⃣ Earth Level

- [ ] **Generators**:
  - Cargo Ship Infestors — Global shipping routes expand potential for growth
  - Airplane Spore Units — Airborne routes expand potential for growth
  - Forest Hive Colonies — Rural mass production
- [ ] **Upgrades**:
  - Intercontinental Mutation — Adapts to all climates for better growth
  - Planetary Stealth Mode — Slip behind Mother Nature's back to improve growth
  - Accelerated Core Evolution — Planetary-level output boost

#### 7️⃣ Solar System Level

- [ ] **Generators**:
  - Terraforming Ooze — Manufactures new planets for growth colonization
  - Asteroid Seeder — Fires growth pods across space
  - Starship Incubator — Grows biomass on interstellar ships
- [ ] **Upgrades**:
  - Cosmic Radiation Tolerance — Survive and multiplies anywhere in the galaxy
  - Faster-Than-Light Spread — Instant intergalaxial slime spread
  - Self-Replicating Probes — Automated seeding of new established worlds

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
  baseEffect: number, // biomass per second
  costMultiplier: 1.15,
  levelRequired: 'level-id' // Which level unlocks this
}
```

### Upgrade Categories

Upgrades fall into these main categories:

- **Click Power**: Increase manual click effectiveness
- **Generator Efficiency**: Boost specific generator types or all generators
- **Overall Growth**: Multiply total biomass growth rate
- **Cost Reduction**: Reduce generator or upgrade costs

### Upgrade Template

```typescript
{
  id: 'upgrade-id',
  name: 'Upgrade Name',
  cost: number,
  description: 'What this upgrade does',
  effect: number,
  type: 'click' | 'growth' | 'efficiency' | 'cost',
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
