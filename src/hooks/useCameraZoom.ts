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

// Level-specific zoom ranges (zoom decreases as blob grows)
const ZOOM_RANGES = {
    intro: { start: 1.0, end: 0.9 }, // Minimal zoom out for tutorial
    microscopic: { start: 1.0, end: 0.7 },
    "petri-dish": { start: 1.0, end: 0.5 },
    lab: { start: 1.0, end: 0.3 },
    city: { start: 1.0, end: 0.2 },
    earth: { start: 1.0, end: 0.1 },
    "solar-system": { start: 1.0, end: 0.05 },
};

// Helper functions
const lerp = (start: number, end: number, factor: number): number => {
    return start + (end - start) * factor;
};

// Calculate zoom based on progress within current level
const calculateEvolutionZoom = (
    biomass: number,
    currentLevel: Level,
    nextLevel: Level
) => {
    const progressInLevel = Math.max(0, biomass - currentLevel.biomassThreshold);
    const levelRange = nextLevel.biomassThreshold - currentLevel.biomassThreshold;
    const progressRatio = Math.min(1, progressInLevel / levelRange);

    const { start, end } = ZOOM_RANGES[currentLevel.name as keyof typeof ZOOM_RANGES] || ZOOM_RANGES.intro;
    const zoomCurve = Math.sqrt(progressRatio); // Gradual zoom out

    return start - zoomCurve * (start - end);
};

// Screen bounds calculation with HUD consideration
const calculateMaxZoom = (blobSize: number) => {
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;
    const hudWidth = 350;
    const padding = 50; // Minimum padding around blob

    const availableWidth = screenWidth - hudWidth;
    const availableHeight = screenHeight;

    const maxZoomForWidth = (availableWidth - padding) / blobSize;
    const maxZoomForHeight = (availableHeight - padding) / blobSize;

    return Math.min(maxZoomForWidth, maxZoomForHeight);
};

export const useCameraZoom = ({ gameState, currentLevel }: UseCameraZoomProps) => {
    const [cameraState, setCameraState] = useState<CameraState>({
        currentZoom: 1.0,
        targetZoom: 1.0,
        isEvolving: false,
    });

    const lastLevelIdRef = useRef(currentLevel.id);

    // Handle evolution events
    useEffect(() => {
        if (currentLevel.id !== lastLevelIdRef.current) {
            // Evolution detected - reset zoom
            setCameraState((prev) => ({
                ...prev,
                targetZoom: 1.0,
                isEvolving: true,
            }));

            // Clear evolution state after animation
            setTimeout(() => {
                setCameraState((prev) => ({ ...prev, isEvolving: false }));
            }, 1000);

            lastLevelIdRef.current = currentLevel.id;
        }
    }, [currentLevel.id]);

    // Calculate target zoom based on biomass progress
    const targetZoom = useMemo(() => {
        if (cameraState.isEvolving) return 1.0;

        const nextLevel = getNextLevel(currentLevel);
        if (!nextLevel) {
            // At max level, use simple logarithmic zoom
            const desiredZoom = Math.max(0.05, 1.0 - Math.log10(gameState.biomass + 1) * 0.3);
            return Math.min(desiredZoom, 1.0);
        }

        const calculatedZoom = calculateEvolutionZoom(
            gameState.biomass,
            currentLevel,
            nextLevel
        );

        // Apply screen bounds constraint
        const blobSize = Math.max(50, gameState.biomass * 10);
        const maxZoom = calculateMaxZoom(blobSize);
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