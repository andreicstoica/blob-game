import { useMemo, useRef, useEffect, useState } from "react";
import { getNextLevel } from "../engine/content/levels";
import type { GameState } from "../engine/core/game";
import type { Level } from "../engine/content/levels";

interface UseCameraZoomProps {
    gameState: GameState;
    currentLevel: Level;
}

export const useCameraZoom = ({ gameState, currentLevel }: UseCameraZoomProps) => {
    const smoothZoomRef = useRef(1.0);
    const [currentSmoothZoom, setCurrentSmoothZoom] = useState(1.0);
    const lastLevelIdRef = useRef(currentLevel.id);

    // Calculate target zoom based on level progress
    const targetZoom = useMemo(() => {
        const biomass = gameState.biomass;
        const nextLevel = getNextLevel(currentLevel);

        /*TODO get blobsize from gameState or HUD, don't double calculate it */
        // Calculate blob size (same as used by Blob component)
        const blobSize = Math.max(50, biomass * 10);

        // Calculate maximum zoom to keep blob visible with padding
        const screenWidth = window.innerWidth;
        const screenHeight = window.innerHeight;
        const padding = 100; // Minimum padding around blob

        // Account for HUD on the left (350px width)
        const availableWidth = screenWidth - 350;
        const availableHeight = screenHeight;

        // Calculate max zoom that keeps blob within bounds
        const maxZoomForWidth = (availableWidth - padding) / blobSize;
        const maxZoomForHeight = (availableHeight - padding) / blobSize;
        const maxZoomForVisibility = Math.min(maxZoomForWidth, maxZoomForHeight);

        if (!nextLevel) {
            // At max level, use simple logarithmic zoom but respect visibility
            const desiredZoom = Math.max(0.05, 1.0 - Math.log10(biomass + 1) * 0.3);
            return Math.min(desiredZoom, maxZoomForVisibility);
        }

        // Calculate progress within current level
        const levelStartBiomass = currentLevel.biomassThreshold;
        const levelEndBiomass = nextLevel.biomassThreshold;
        const progressInLevel = Math.max(0, biomass - levelStartBiomass);
        const levelRange = levelEndBiomass - levelStartBiomass;

        // Handle edge case where level range is very small
        if (levelRange <= 0) {
            return Math.min(0.8, maxZoomForVisibility);
        }

        const progressRatio = Math.min(1, progressInLevel / levelRange);

        // Different zoom ranges for different levels
        let startZoom = 1.0;
        let endZoom = 0.25;

        switch (currentLevel.name) {
            case 'intro':
                startZoom = 1.0;
                endZoom = 0.4;
                break;
            case 'microscopic':
                startZoom = 1.0;
                endZoom = 0.3;
                break;
            case 'petri-dish':
                startZoom = 1.0;
                endZoom = 0.2;
                break;
            case 'lab':
                startZoom = 1.0;
                endZoom = 0.15;
                break;
            case 'city':
                startZoom = 1.0;
                endZoom = 0.1;
                break;
            case 'earth':
                startZoom = 1.0;
                endZoom = 0.05;
                break;
            case 'solar-system':
                startZoom = 1.0;
                endZoom = 0.03;
                break;
        }

        // Use square root for more gradual zoom-out
        const zoomCurve = Math.sqrt(progressRatio);
        const calculatedZoom = startZoom - (zoomCurve * (startZoom - endZoom));

        // Apply visibility constraint
        const finalZoom = Math.min(calculatedZoom, maxZoomForVisibility);

        return Math.max(0.02, finalZoom);
    }, [gameState.biomass, currentLevel]);

    // Handle level changes - reset zoom immediately when evolving
    useEffect(() => {
        if (currentLevel.id !== lastLevelIdRef.current) {
            smoothZoomRef.current = 1.0;
            setCurrentSmoothZoom(1.0);
            lastLevelIdRef.current = currentLevel.id;
        }
    }, [currentLevel.id]);

    // Smooth zoom animation
    useEffect(() => {
        let animationId: number;

        const animate = () => {
            const current = smoothZoomRef.current;
            const target = targetZoom;
            const difference = target - current;

            // Slower lerp for smoother transitions
            const lerpSpeed = 0.015;

            if (Math.abs(difference) > 0.001) {
                smoothZoomRef.current = current + (difference * lerpSpeed);
                setCurrentSmoothZoom(smoothZoomRef.current);
                animationId = requestAnimationFrame(animate);
            }
        };

        animationId = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(animationId);
    }, [targetZoom]);

    return currentSmoothZoom;
}; 