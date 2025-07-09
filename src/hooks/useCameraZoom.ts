import { useMemo, useRef, useEffect, useState } from "react";
import { getNextLevel } from "../engine/levels";
import type { GameState } from "../engine/game";
import type { Level } from "../engine/levels";

interface UseCameraZoomProps {
    gameState: GameState;
    currentLevel: Level;
}

interface CameraState {
    currentZoom: number;
    targetZoom: number;
    complexity: number;
    lastGrowthRate: number;
    lastUpdateTime: number;
}

/*
What it’s for:
It’s a data structure for tracking things like:
Current level (1-7)
Growth rate (biomass/sec)
Generator count
Upgrade count
Time spent in current level
The idea is: as the game gets more complex, you could pass a ZoomComplexity object to a function that decides which zoom effects/curves to apply, or to a “zoom AI” that makes the camera feel more alive.
Why it’s unused:
The current implementation bakes the logic directly into the hook and helpers, using the same data, but not as a single object.
If you want to refactor for more modularity or to support “zoom AI”/emergent behaviors, you’d use this interface as the input to a function that returns the zoom value and effects.
TL;DR:
It’s a spec artifact for extensibility and clarity, not a bug. You can safely delete it for now, or use it if you want to centralize zoom logic in a more data-driven way later.
Let me know if you want a quick example of how to use it, or if you want it removed for now.
*/
interface ZoomComplexity {
    level: number;
    growthRate: number;
    generatorCount: number;
    upgradeCount: number;
    timeInLevel: number;
}

// Level-specific zoom ranges
const ZOOM_RANGES = {
    intro: { start: 1.0, end: 0.8 },
    microscopic: { start: 1.0, end: 0.6 },
    "petri-dish": { start: 1.0, end: 0.4 },
    lab: { start: 1.0, end: 0.25 },
    city: { start: 1.0, end: 0.15 },
    earth: { start: 1.0, end: 0.08 },
    "solar-system": { start: 1.0, end: 0.04 },
};

// Complexity configuration for different levels
const COMPLEXITY_CONFIG = {
    intro: {
        zoomCurve: "linear",
        effects: ["base"],
        complexity: 1,
    },
    microscopic: {
        zoomCurve: "square_root",
        effects: ["base", "growth_rate"],
        complexity: 2,
    },
    "petri-dish": {
        zoomCurve: "cubic",
        effects: ["base", "growth_rate", "generator_milestones"],
        complexity: 3,
    },
    lab: {
        zoomCurve: "exponential",
        effects: ["base", "growth_rate", "generator_milestones", "speed_bonus"],
        complexity: 4,
    },
    city: {
        zoomCurve: "exponential",
        effects: [
            "base",
            "growth_rate",
            "generator_milestones",
            "speed_bonus",
            "upgrade_bonus",
        ],
        complexity: 5,
    },
    earth: {
        zoomCurve: "chaotic",
        effects: [
            "base",
            "growth_rate",
            "generator_milestones",
            "speed_bonus",
            "upgrade_bonus",
            "time_bonus",
        ],
        complexity: 6,
    },
    "solar-system": {
        zoomCurve: "chaotic",
        effects: [
            "base",
            "growth_rate",
            "generator_milestones",
            "speed_bonus",
            "upgrade_bonus",
            "time_bonus",
            "performance_bonus",
        ],
        complexity: 7,
    },
};

// Generator milestone effects
const GENERATOR_MILESTONES = {
    10: { zoom: 1.1, duration: 500 },
    25: { zoom: 1.15, duration: 600 },
    50: { zoom: 1.2, duration: 700 },
    100: { zoom: 1.25, duration: 800 },
    250: { zoom: 1.3, duration: 900 },
    500: { zoom: 1.35, duration: 1000 },
    1000: { zoom: 1.4, duration: 1200 },
};

// Evolution sequences for different levels
const EVOLUTION_SEQUENCES = {
    intro: {
        phases: [
            { duration: 300, zoom: 1.0, easing: "easeOut" },
            { duration: 700, zoom: 0.8, easing: "easeInOut" },
        ],
    },
    lab: {
        phases: [
            { duration: 200, zoom: 1.0, easing: "easeOut", effect: "pause" },
            { duration: 400, zoom: 0.3, easing: "easeOut", effect: "dramatic_zoom" },
            { duration: 600, zoom: 0.25, easing: "easeInOut", effect: "settle" },
        ],
    },
    "solar-system": {
        phases: [
            { duration: 150, zoom: 1.0, easing: "easeOut", effect: "pause" },
            { duration: 300, zoom: 0.1, easing: "easeOut", effect: "dramatic_zoom" },
            { duration: 200, zoom: 0.15, easing: "easeIn", effect: "bounce" },
            { duration: 500, zoom: 0.04, easing: "easeInOut", effect: "settle" },
        ],
    },
};

// Helper functions
const lerp = (start: number, end: number, factor: number): number => {
    return start + (end - start) * factor;
};

const calculateBaseZoom = (biomass: number, currentLevel: Level): number => {
    const nextLevel = getNextLevel(currentLevel);
    const zoomRange = ZOOM_RANGES[currentLevel.name as keyof typeof ZOOM_RANGES] || ZOOM_RANGES.intro;

    if (!nextLevel) {
        // At max level, use simple logarithmic zoom
        const desiredZoom = Math.max(0.05, 1.0 - Math.log10(biomass + 1) * 0.3);
        return Math.min(desiredZoom, 1.0);
    }

    // Calculate progress within current level
    const levelStartBiomass = currentLevel.biomassThreshold;
    const levelEndBiomass = nextLevel.biomassThreshold;
    const progressInLevel = Math.max(0, biomass - levelStartBiomass);
    const levelRange = levelEndBiomass - levelStartBiomass;

    if (levelRange <= 0) {
        return zoomRange.end;
    }

    const progressRatio = Math.min(1, progressInLevel / levelRange);
    const zoomCurve = Math.sqrt(progressRatio);
    const calculatedZoom = zoomRange.start - (zoomCurve * (zoomRange.start - zoomRange.end));

    return Math.max(0.02, calculatedZoom);
};

const calculateGrowthZoom = (growthRate: number, level: number): number => {
    const baseMultiplier = 1.0;
    const growthMultiplier = Math.min(2.0, 1.0 + growthRate / 1000);

    // Late game: More dramatic growth effects
    if (level >= 5) {
        return baseMultiplier * Math.pow(growthMultiplier, 1.5);
    }

    return baseMultiplier * growthMultiplier;
};

const checkGeneratorMilestones = (generatorCount: number, currentZoom: number) => {
    const milestone = GENERATOR_MILESTONES[generatorCount as keyof typeof GENERATOR_MILESTONES];
    if (milestone) {
        return {
            targetZoom: currentZoom * milestone.zoom,
            duration: milestone.duration,
            type: "generator_milestone",
        };
    }
    return null;
};

const calculateSpeedZoom = (growthRate: number, previousGrowthRate: number, level: number): number => {
    if (level < 4) return 1.0; // Only active in mid-late game

    const acceleration = growthRate - previousGrowthRate;
    const speedMultiplier = 1.0 + acceleration / 10000;

    // Cap the effect to prevent extreme zoom changes
    return Math.max(0.8, Math.min(1.3, speedMultiplier));
};

const calculatePerformanceZoom = (gameState: GameState, level: number): number => {
    if (level < 6) return 1.0; // Only in late game

    const efficiency = calculatePlayerEfficiency(gameState);
    const performanceMultiplier = 0.9 + efficiency * 0.4;

    return performanceMultiplier;
};

const calculatePlayerEfficiency = (gameState: GameState): number => {
    // Calculate how efficiently the player is progressing
    const biomass = gameState.biomass;
    const generators = Object.values(gameState.generators);
    const upgrades = Object.values(gameState.upgrades).filter((u) => u.purchased);

    const generatorEfficiency = generators.reduce((sum, gen) => sum + gen.level, 0) / Math.max(1, biomass);
    const upgradeEfficiency = upgrades.length / Math.max(1, biomass / 1000000);

    return (generatorEfficiency + upgradeEfficiency) / 2;
};

const createEvolutionAnimation = (sequence: any) => {
    let currentPhase = 0;
    let phaseStartTime = Date.now();
    let currentPhaseData = sequence.phases[currentPhase];

    return () => {
        const now = Date.now();
        const phaseElapsed = now - phaseStartTime;
        const phaseProgress = Math.min(1, phaseElapsed / currentPhaseData.duration);

        let zoom = currentPhaseData.zoom;

        // Apply easing
        if (currentPhaseData.easing === "easeOut") {
            zoom = lerp(currentPhaseData.zoom, sequence.phases[currentPhase + 1]?.zoom || currentPhaseData.zoom, 1 - Math.pow(1 - phaseProgress, 3));
        } else if (currentPhaseData.easing === "easeInOut") {
            zoom = lerp(currentPhaseData.zoom, sequence.phases[currentPhase + 1]?.zoom || currentPhaseData.zoom, phaseProgress < 0.5 ? 2 * phaseProgress * phaseProgress : 1 - Math.pow(-2 * phaseProgress + 2, 2) / 2);
        }

        if (phaseProgress >= 1) {
            currentPhase++;
            if (currentPhase >= sequence.phases.length) {
                return null; // Animation complete
            }
            currentPhaseData = sequence.phases[currentPhase];
            phaseStartTime = now;
        }

        return zoom;
    };
};

const createMilestoneAnimation = (baseZoom: number, milestone: any) => {
    let startTime = Date.now();
    let startZoom = baseZoom;

    return () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(1, elapsed / milestone.duration);

        if (progress >= 1) {
            return null; // Animation complete
        }

        // Simple ease-out animation
        const easeOut = 1 - Math.pow(1 - progress, 3);
        return lerp(startZoom, milestone.targetZoom, easeOut);
    };
};

export const useCameraZoom = ({ gameState, currentLevel }: UseCameraZoomProps) => {
    const [cameraState, setCameraState] = useState<CameraState>({
        currentZoom: 1.0,
        targetZoom: 1.0,
        complexity: 1,
        lastGrowthRate: 0,
        lastUpdateTime: Date.now(),
    });

    const lastLevelIdRef = useRef(currentLevel.id);
    const evolutionAnimationRef = useRef<(() => number | null) | null>(null);
    const milestoneAnimationRef = useRef<(() => number | null) | null>(null);
    const levelStartTimeRef = useRef(Date.now());

    // Calculate base zoom with complexity
    const baseZoom = useMemo(() => {
        const complexity = COMPLEXITY_CONFIG[currentLevel.name as keyof typeof COMPLEXITY_CONFIG] || COMPLEXITY_CONFIG.intro;
        let zoom = calculateBaseZoom(gameState.biomass, currentLevel);

        // Apply complexity-based effects
        if (complexity.effects.includes("growth_rate")) {
            zoom *= calculateGrowthZoom(gameState.growth, currentLevel.id);
        }

        if (complexity.effects.includes("generator_milestones")) {
            const totalGenerators = Object.values(gameState.generators).reduce((sum, gen) => sum + gen.level, 0);
            const milestone = checkGeneratorMilestones(totalGenerators, zoom);
            if (milestone) {
                milestoneAnimationRef.current = createMilestoneAnimation(zoom, milestone);
            }
        }

        if (complexity.effects.includes("speed_bonus")) {
            zoom *= calculateSpeedZoom(gameState.growth, cameraState.lastGrowthRate, currentLevel.id);
        }

        if (complexity.effects.includes("performance_bonus")) {
            zoom *= calculatePerformanceZoom(gameState, currentLevel.id);
        }

        // Calculate screen bounds
        const blobSize = Math.max(50, gameState.biomass * 10);
        const screenWidth = window.innerWidth;
        const screenHeight = window.innerHeight;
        const padding = 100;
        const availableWidth = screenWidth - 350; // Account for HUD
        const availableHeight = screenHeight;

        const maxZoomForWidth = (availableWidth - padding * 2) / blobSize;
        const maxZoomForHeight = (availableHeight - padding * 2) / blobSize;
        const maxZoomForVisibility = Math.min(maxZoomForWidth, maxZoomForHeight);

        // Apply visibility constraint
        return Math.min(zoom, maxZoomForVisibility);
    }, [gameState, currentLevel, cameraState.lastGrowthRate]);

    // Handle evolution events
    useEffect(() => {
        if (currentLevel.id !== lastLevelIdRef.current) {
            const evolutionSequence = EVOLUTION_SEQUENCES[currentLevel.name as keyof typeof EVOLUTION_SEQUENCES] || EVOLUTION_SEQUENCES.intro;
            evolutionAnimationRef.current = createEvolutionAnimation(evolutionSequence);

            // Reset level start time
            levelStartTimeRef.current = Date.now();
            lastLevelIdRef.current = currentLevel.id;
        }
    }, [currentLevel.id]);

    // Main animation loop
    useEffect(() => {
        let animationId: number;

        const getMaxZoomForVisibility = () => {
            // Calculate screen bounds and blob size
            const blobSize = Math.max(50, gameState.biomass * 10);
            const screenWidth = window.innerWidth;
            const screenHeight = window.innerHeight;
            const padding = 100;
            const availableWidth = screenWidth - 350; // Account for HUD
            const availableHeight = screenHeight;
            // Use padding * 2 since blob is centered
            const maxZoomForWidth = (availableWidth - padding * 2) / blobSize;
            const maxZoomForHeight = (availableHeight - padding * 2) / blobSize;
            return Math.max(0.02, Math.min(maxZoomForWidth, maxZoomForHeight));
        };

        const animate = () => {
            let newZoom = cameraState.currentZoom;

            // Priority: Evolution animation
            if (evolutionAnimationRef.current) {
                const evolutionZoom = evolutionAnimationRef.current();
                if (evolutionZoom === null) {
                    evolutionAnimationRef.current = null;
                } else {
                    newZoom = evolutionZoom;
                }
            }
            // Secondary: Milestone animation
            else if (milestoneAnimationRef.current) {
                const milestoneZoom = milestoneAnimationRef.current();
                if (milestoneZoom === null) {
                    milestoneAnimationRef.current = null;
                } else {
                    newZoom = milestoneZoom;
                }
            }
            // Default: Smooth transition to target
            else {
                newZoom = lerp(cameraState.currentZoom, baseZoom, 0.015);
            }

            // Failsafe: Clamp zoom to max allowed for current blob size/screen
            const maxZoomForVisibility = getMaxZoomForVisibility();
            if (newZoom > maxZoomForVisibility) {
                newZoom = maxZoomForVisibility;
            }
            if (newZoom < 0.02) {
                newZoom = 0.02;
            }

            setCameraState((prev) => ({
                ...prev,
                currentZoom: newZoom,
                lastGrowthRate: gameState.growth,
                lastUpdateTime: Date.now(),
                // @ts-ignore
                maxZoomForVisibility, // for debug
            }));

            animationId = requestAnimationFrame(animate);
        };

        animationId = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(animationId);
    }, [cameraState, baseZoom, gameState.growth]);

    // Return maxZoomForVisibility for debug (optional, remove if not needed)
    const maxZoomForVisibility = (() => {
        const blobSize = Math.max(50, gameState.biomass * 10);
        const screenWidth = window.innerWidth;
        const screenHeight = window.innerHeight;
        const padding = 100;
        const availableWidth = screenWidth - 350;
        const availableHeight = screenHeight;
        const maxZoomForWidth = (availableWidth - padding * 2) / blobSize;
        const maxZoomForHeight = (availableHeight - padding * 2) / blobSize;
        return Math.max(0.02, Math.min(maxZoomForWidth, maxZoomForHeight));
    })();

    return { zoom: cameraState.currentZoom, maxZoomForVisibility };
}; 