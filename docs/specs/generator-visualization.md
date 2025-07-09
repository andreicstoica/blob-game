# Generator Visualization Feature

## Overview

Display visual representations of purchased generators around the blob on the map. Each generator type will be shown as emojis corresponding to their level theme, with the count matching the number of generators purchased.

## Phase 1: Static Generator Emojis

### Requirements

#### Visual Representation

- **Emoji Mapping**: Each generator type displays as its corresponding level emoji
  - Microscopic Cloner → 🔬 (Microscope)
  - Petri Dish → 🦠 (Microbe)
  - Lab Equipment → 🧪 (Test Tube)
  - City Infrastructure → 🏢 (Building)
  - Earth Systems → 🌍 (Earth)
  - Solar System → ⭐ (Star)
  - Galaxy → 🌌 (Galaxy)

#### Positioning

- **Ring Distribution**: Emojis positioned in a ring around the blob
- **Random Offset**: Each emoji has slight random offset from perfect ring position
- **Fixed Distance**: Ring radius stays constant (doesn't scale with blob size)
- **Static Position**: Emojis don't move (for Phase 1)

#### Layout Logic

- **Count Display**: Show exactly X emojis for X generators purchased
- **Type Grouping**: Group emojis by generator type
- **Spacing**: Evenly distribute emojis around the ring with random variation
- **Size**: Consistent emoji size (slightly larger than current level indicators)

### Technical Implementation

#### New Component: `GeneratorVisualization`

```typescript
interface GeneratorVisualizationProps {
  gameState: GameState;
  blobPosition: { x: number; y: number };
  blobSize: number;
}
```

#### Positioning Algorithm

```typescript
function calculateGeneratorPositions(
  generators: Record<string, GeneratorState>,
  blobPosition: { x: number; y: number },
  ringRadius: number
): GeneratorEmoji[] {
  // For each generator type with count > 0
  // Calculate positions in ring around blob
  // Add random offset to each position
}
```

#### Data Structure

```typescript
interface GeneratorEmoji {
  generatorId: string;
  emoji: string;
  position: { x: number; y: number };
  count: number;
}
```

### UI/UX Details

- **Z-Index**: Render above map, below HUD
- **Opacity**: Slightly transparent (0.8) to not overwhelm
- **Hover**: Show generator name and count on hover
- **Performance**: Use React.memo to prevent unnecessary re-renders

## Phase 2: FloatingNumber Animations (Future)

### Animation Requirements

- **Frequency**: Every 1 second per generator type
- **Content**: Show individual generator's accurate growth contribution
- **Color**: Based on contribution amount (green for high, yellow for medium, red for low)
- **Position**: Start from emoji position, float upward

### FloatingNumber Modifications Needed

- Customizable trigger timing
- Position-based spawning
- Color customization based on value
- Content customization (generator-specific growth values)

## Success Criteria

- [ ] Emojis appear around blob for each purchased generator
- [ ] Count matches generator purchases exactly
- [ ] Positions are visually appealing and not cluttered
- [ ] Performance remains smooth with many generators
- [ ] Hover tooltips show generator info

## Future Enhancements

- Emoji movement/rotation around blob
- Scaling with blob size
- Click interactions
- Animation pooling for performance
- Visual effects for generator upgrades
