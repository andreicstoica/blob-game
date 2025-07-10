# Progression Scaling Spec (v2.4)

## Design Philosophy

- Progression should feel fast and exciting in the early game, with each new level unlocking powerful new tools.
- The generator pyramid (i.e. the number of each generator the player has at any given point in the game, roughly in a "pyramid distribution") is _relative_ to the player's current progression: as new generators are unlocked, the player buys more of the lower tiers, but the pyramid "moves up" as the game progresses and new more powerful generators are unlocked.
- Upgrades are mostly multiplicative and often target specific generator tiers (i.e. generators unlocked on level \_\_), keeping early-game content relevant.
- Clicking is important early, but generators and upgrades dominate mid/late game. Power-ups add bursts of excitement and strategy, especially late game.
- The game should be completable in 20 minutes for MVP, with experienced players able to speedrun early levels.

## Level Timeline (Target Playtime)

| Level        | Target Time (cumulative) |
| ------------ | ------------------------ |
| Microscopic  | 1:00                     |
| Petri Dish   | 3:00                     |
| Lab          | 6:00                     |
| City         | 10:00                    |
| Earth        | 15:00                    |
| Solar System | 20:00                    |

## Level Thresholds & Expected Growth

| Level        | Biomass Threshold      |
| ------------ | ---------------------- |
| Microscopic  | 6,000                  |
| Petri Dish   | 2,500,000              |
| Lab          | 1,500,000,000          |
| City         | 800,000,000,000        |
| Earth        | 60,000,000,000,000     |
| Solar System | 32,000,000,000,000,000 |

## Generator & Upgrade Structure

- Each level unlocks 3 new generators and 3 new upgrades.
- Generator cost scaling (per purchase): **1.15x**
- Generator base cost scaling (between types): **~6-8x** (not exact Cookie Clicker numbers, but dramatic)
- Generator growth scaling: Each new generator is ~5x as powerful as the previous.
- Upgrades: Multiplicative, mostly target specific generator tiers. Early upgrades: 1.25x–2x, mid: 3x–5x, late: up to 10x.
- Click power: Starts at **0.001**. Upgrades/evolutions keep it at ~5–10% of total growth rate.

## Power-Ups (MVP)

- Appear randomly every 30–60 seconds.
- Effects: 1.25x–3x growth for 15–20s, or +50% biomass, or 20s shop discount.
- For MVP, use same scaling as upgrades. More advanced effects in future.

## Example Generator Table (All Levels, No Basic Generator)

| Level        | Generator Name        | Base Cost              | Growth/sec    | Cost Scaling | Unlocks At |
| ------------ | --------------------- | ---------------------- | ------------- | ------------ | ---------- |
| Microscopic  | Microscopic Cloner    | 90                     | 0.005         | 1.15x        | Micro      |
| Microscopic  | Cell Divider          | 700                    | 0.025         | 1.15x        | Micro      |
| Microscopic  | Nucleus Replicator    | 5,000                  | 0.125         | 1.15x        | Micro      |
| Petri Dish   | Colony Expansion      | 35,000                 | 0.625         | 1.15x        | Petri      |
| Petri Dish   | Spore Launcher        | 250,000                | 3.13          | 1.15x        | Petri      |
| Petri Dish   | Contaminant Converter | 1,800,000              | 15.6          | 1.15x        | Petri      |
| Lab          | Centrifuge Sorter     | 13,000,000             | 78.1          | 1.15x        | Lab        |
| Lab          | Bioreactor Tank       | 90,000,000             | 391           | 1.15x        | Lab        |
| Lab          | Autoclave Recycler    | 650,000,000            | 1,950         | 1.15x        | Lab        |
| City         | Humanoid Slimes       | 4,500,000,000          | 9,770         | 1.15x        | City       |
| City         | Sewer Colonies        | 32,000,000,000         | 48,800        | 1.15x        | City       |
| City         | Subway Spreaders      | 230,000,000,000        | 244,000       | 1.15x        | City       |
| Earth        | Cargo Ship Infestors  | 1,600,000,000,000      | 1,220,000     | 1.15x        | Earth      |
| Earth        | Airplane Spore Units  | 11,000,000,000,000     | 6,100,000     | 1.15x        | Earth      |
| Earth        | Forest Hive Colonies  | 80,000,000,000,000     | 30,500,000    | 1.15x        | Earth      |
| Solar System | Terraforming Ooze     | 600,000,000,000,000    | 153,000,000   | 1.15x        | Solar      |
| Solar System | Asteroid Seeder       | 4,000,000,000,000,000  | 763,000,000   | 1.15x        | Solar      |
| Solar System | Starship Incubator    | 28,000,000,000,000,000 | 3,810,000,000 | 1.15x        | Solar      |

## Example Upgrade Table (All Levels)

| Level        | Upgrade Name               | Effect (Multiplier) | Targets              | Cost                   |
| ------------ | -------------------------- | ------------------- | -------------------- | ---------------------- |
| Microscopic  | Enhanced Microscope Optics | 1.5x                | Microscopic Cloner   | 500                    |
| Microscopic  | Sterile Technique Mastery  | 2x                  | Cell Divider         | 1,500                  |
| Microscopic  | Rapid Binary Fission       | 3x                  | Nucleus Replicator   | 5,000                  |
| Petri Dish   | Temperature Control Module | 3x                  | All Microscopic Gens | 35,000                 |
| Petri Dish   | Nutrient-Enriched Agar     | 3x                  | All Petri Gens       | 250,000                |
| Petri Dish   | Antibiotic Resistance      | 2x                  | All Petri Gens       | 1,800,000              |
| Lab          | Lab Assistant Automation   | 5x                  | All Petri Gens       | 13,000,000             |
| Lab          | Sterile Workflow           | 5x                  | All Lab Gens         | 90,000,000             |
| Lab          | Precision Pipetting        | 3x                  | All Lab Gens         | 650,000,000            |
| City         | Mimicry Training           | 5x                  | All Lab Gens         | 4,500,000,000          |
| City         | Urban Camouflage           | 5x                  | All City Gens        | 32,000,000,000         |
| City         | Subway Expansion Plan      | 3x                  | All City Gens        | 230,000,000,000        |
| Earth        | Intercontinental Mutation  | 10x                 | All City Gens        | 1,600,000,000,000      |
| Earth        | Planetary Stealth Mode     | 10x                 | All Earth Gens       | 11,000,000,000,000     |
| Earth        | Accelerated Core Evolution | 5x                  | All Earth Gens       | 80,000,000,000,000     |
| Solar System | Cosmic Radiation Tolerance | 10x                 | All Earth Gens       | 600,000,000,000,000    |
| Solar System | Faster-Than-Light Spread   | 10x                 | All Solar Gens       | 4,000,000,000,000,000  |
| Solar System | Self-Replicating Probes    | 5x                  | All Solar Gens       | 28,000,000,000,000,000 |

## Sample Playthrough Table (All Levels, 1.75^n Pyramid, No Basic Generator)

| Level        | Time (min) | Biomass Threshold      | Pyramid (Gen Counts, 1.75^n from top)                                                                                                                                                                                           | Upgrades Bought |
| ------------ | ---------- | ---------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------- |
| Microscopic  | 1.0        | 6,000                  | 1 Replicator, 2 Divider, 3 Cloner                                                                                                                                                                                               | 3 Micros        |
| Petri Dish   | 2.0        | 2,500,000              | 1 Converter, 2 Spore, 3 Colony, 5 Replicator, 8 Divider, 14 Cloner                                                                                                                                                              | 3 Petri         |
| Lab          | 3.0        | 1,500,000,000          | 1 Recycler, 2 Tank, 3 Sorter, 5 Converter, 8 Spore, 14 Colony, 25 Replicator, 43 Divider, 75 Cloner                                                                                                                             | 3 Lab           |
| City         | 4.0        | 800,000,000,000        | 1 Spreader, 2 Colonies, 3 Slimes, 5 Recycler, 8 Tank, 14 Sorter, 25 Converter, 43 Spore, 75 Colony, 131 Replicator, 229 Divider, 400 Cloner                                                                                     | 3 City          |
| Earth        | 5.0        | 60,000,000,000,000     | 1 Hive, 2 Units, 3 Infestors, 5 Spreader, 8 Colonies, 14 Slimes, 25 Recycler, 43 Tank, 75 Sorter, 131 Converter, 229 Spore, 400 Colony, 700 Replicator, 1,225 Divider, 2,144 Cloner                                             | 3 Earth         |
| Solar System | 5.0        | 32,000,000,000,000,000 | 1 Incubator, 2 Seeder, 3 Ooze, 5 Hive, 8 Units, 14 Infestors, 25 Spreader, 43 Colonies, 75 Slimes, 131 Recycler, 229 Tank, 400 Sorter, 700 Converter, 1,225 Spore, 2,144 Colony, 3,752 Replicator, 6,566 Divider, 11,491 Cloner | 3 Solar         |

## Formulas

- **Generator Cost (nth purchase):** `baseCost × (costScaling ^ (n-1))`
- **Generator Growth:** `baseGrowth × (growthScaling ^ (genIndex))`
- **Upgrade Effect:** Multiplicative, as listed in table
- **Biomass Threshold:** Set manually to ensure progression is achievable and fun

## Notes

- All numbers are rough and for illustration; will be tuned after playtesting.
- Power-ups, cost reducers, and advanced upgrade types are in the advanced spec.
- Click power upgrades and evolution boosts will be tuned to keep clicking relevant early and as a supplement later.

---

See `advanced-progression.md` for more experimental ideas.
