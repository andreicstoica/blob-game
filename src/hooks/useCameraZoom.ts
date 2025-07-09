import { useMemo, useRef, useEffect, useState } from "react";
import { getNextLevel } from "../engine/content/levels";
import type { GameState } from "../engine/core/game";
import type { Level } from "../engine/content/levels";

interface UseCameraZoomProps {
    gameState: GameState;
    currentLevel: Level;
}

interface CameraState {
    currentZoom: number;
    targetZoom: number;
    isEvolving: boolean;
}

// Level-specific zoom ranges (zoom decreases from start to end)
const ZOOM_RANGES = {
    intro: { start: 10.0, end: 1.0 }, // Start zoomed in, end at normal
    microscopic: { start: 10.0, end: 1.0 },
    "petri-dish": { start: 10.0, end: 1.0 },
    lab: { start: 10.0, end: 1.0 },
    city: { start: 10.0, end: 1.0 },
    earth: { start: 10.0, end: 1.0 },
    "solar-system": { start: 10.0, end: 1.0 },
};

// Helper functions
const lerp = (start: number, end: number, factor: number): number => {
    return start + (end - start) * factor;
};

// Calculate zoom based on progress within current level
const calculateLevelZoom = (
    biomass: number,
    currentLevel: Level,
    nextLevel: Level | null
) => {
    if (!nextLevel) {
        // At max level, use simple logarithmic zoom
        const maxZoom = ZOOM_RANGES[currentLevel.name as keyof typeof ZOOM_RANGES]?.start || 10.0;
        const minZoom = 1.0;
        const progress = Math.min(1, Math.log10(biomass + 1) / 10);
        return maxZoom - progress * (maxZoom - minZoom);
    }

    const progressInLevel = Math.max(0, biomass - currentLevel.biomassThreshold);
    const levelRange = nextLevel.biomassThreshold - currentLevel.biomassThreshold;
    const progressRatio = Math.min(1, progressInLevel / levelRange);

    const { start, end } = ZOOM_RANGES[currentLevel.name as keyof typeof ZOOM_RANGES] || ZOOM_RANGES.intro;

    // Use ease-out curve for more natural zoom progression
    const easedProgress = 1 - Math.pow(1 - progressRatio, 2);

    const calculatedZoom = start - easedProgress * (start - end);

    // Debug logging
    console.log(`Zoom calculation: biomass=${biomass}, progress=${progressRatio.toFixed(3)}, zoom=${calculatedZoom.toFixed(3)}`);

    return calculatedZoom;
};

// Screen bounds calculation with HUD consideration
const calculateMaxZoom = () => {
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;
    const hudWidth = 350;
    const padding = 100; // Minimum padding around blob

    const availableWidth = screenWidth - hudWidth - padding;
    const availableHeight = screenHeight - padding;

    // Calculate maximum zoom that keeps blob within bounds
    const maxZoomForWidth = availableWidth / 200; // Assuming 200px blob size
    const maxZoomForHeight = availableHeight / 200;

    return Math.min(maxZoomForWidth, maxZoomForHeight, 10.0); // Cap at 10x zoom
};

export const useCameraZoom = ({ gameState, currentLevel }: UseCameraZoomProps) => {
    // Initialize with the correct starting zoom for the current level
    const initialZoom = ZOOM_RANGES[currentLevel.name as keyof typeof ZOOM_RANGES]?.start || 10.0;

    const [cameraState, setCameraState] = useState<CameraState>({
        currentZoom: initialZoom,
        targetZoom: initialZoom,
        isEvolving: false,
    });

    const lastLevelIdRef = useRef(currentLevel.id);

    // Initialize zoom based on current biomass on mount
    useEffect(() => {
        const nextLevel = getNextLevel(currentLevel);
        const calculatedZoom = calculateLevelZoom(
            gameState.biomass,
            currentLevel,
            nextLevel
        );

        setCameraState((prev) => ({
            ...prev,
            currentZoom: calculatedZoom,
            targetZoom: calculatedZoom,
        }));
    }, []); // Run only on mount

    // Handle evolution events
    useEffect(() => {
        if (currentLevel.id !== lastLevelIdRef.current) {
            // Evolution detected - reset to zoomed-in state
            const newLevelZoom = ZOOM_RANGES[currentLevel.name as keyof typeof ZOOM_RANGES]?.start || 10.0;

            setCameraState((prev) => ({
                ...prev,
                targetZoom: newLevelZoom,
                isEvolving: true,
            }));

            // Clear evolution state after animation (0.5 seconds)
            setTimeout(() => {
                setCameraState((prev) => ({ ...prev, isEvolving: false }));
            }, 500);

            lastLevelIdRef.current = currentLevel.id;
        }
    }, [currentLevel.id]);

    // Calculate target zoom based on biomass progress
    const targetZoom = useMemo(() => {
        if (cameraState.isEvolving) {
            return ZOOM_RANGES[currentLevel.name as keyof typeof ZOOM_RANGES]?.start || 10.0;
        }

        const nextLevel = getNextLevel(currentLevel);
        const calculatedZoom = calculateLevelZoom(
            gameState.biomass,
            currentLevel,
            nextLevel
        );

        // Apply screen bounds constraint
        const maxZoom = calculateMaxZoom();
        return Math.min(calculatedZoom, maxZoom);
    }, [gameState.biomass, currentLevel, cameraState.isEvolving]);

    // Smooth zoom animation
    useEffect(() => {
        setCameraState((prev) => ({
            ...prev,
            targetZoom,
        }));
    }, [targetZoom]);

    // Animation loop
    useEffect(() => {
        let animationId: number;

        const animate = () => {
            setCameraState((prev) => ({
                ...prev,
                currentZoom: lerp(prev.currentZoom, prev.targetZoom, 0.015),
            }));

            animationId = requestAnimationFrame(animate);
        };

        animationId = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(animationId);
    }, [cameraState.targetZoom]);

    return cameraState.currentZoom;
}; 