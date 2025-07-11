import type { GameState } from "../types";
import { MILESTONES } from "../../styles/constants";
import { toast } from "react-toastify";

// Track recently shown notifications to prevent duplicates within a short time
const recentlyShown = new Set<string>();

// Helper function to update state with shown milestone
function markMilestoneAsShown(state: GameState, milestoneId: string): GameState {
    return {
        ...state,
        notifications: {
            ...state.notifications,
            shownMilestones: new Set([...state.notifications.shownMilestones, milestoneId]),
        },
    };
}

// Function to display toast notification (called from actions)
export function displayNotification(message: string, id: string): void {
    // Prevent duplicate notifications within 1 second
    if (recentlyShown.has(id)) return;

    recentlyShown.add(id);
    setTimeout(() => recentlyShown.delete(id), 1000);

    toast(message, {
        position: "bottom-center",
        autoClose: 5000,
        className: "blob-toast",
    });
}

// Check size milestones after biomass changes
export function checkSizeMilestones(state: GameState): { state: GameState; notification?: { message: string; id: string } } {
    // Find the highest milestone that hasn't been shown yet
    const unshownMilestones = MILESTONES.filter(milestone =>
        milestone.biomassThreshold &&
        !state.notifications.shownMilestones.has(milestone.id) &&
        state.biomass >= milestone.biomassThreshold
    );

    // Only show the highest milestone reached (to avoid showing multiple at once)
    if (unshownMilestones.length > 0) {
        const highestMilestone = unshownMilestones.reduce((highest, current) =>
            current.biomassThreshold! > highest.biomassThreshold! ? current : highest
        );

        return {
            state: markMilestoneAsShown(state, highestMilestone.id),
            notification: { message: highestMilestone.message, id: highestMilestone.id }
        };
    }

    return { state };
}

// Check first generator milestone
export function checkFirstGenerator(state: GameState): { state: GameState; notification?: { message: string; id: string } } {
    const hasGenerator = Object.values(state.generators).some((g) => g.level > 0);
    if (hasGenerator && !state.notifications.shownMilestones.has("first-generator")) {
        return {
            state: markMilestoneAsShown(state, "first-generator"),
            notification: {
                message: "Your first generator! Watch your biomass grow automatically. 💪",
                id: "first-generator"
            }
        };
    }
    return { state };
}

// Check first upgrade milestone
export function checkFirstUpgrade(state: GameState): { state: GameState; notification?: { message: string; id: string } } {
    const hasUpgrade = Object.values(state.upgrades).some((u) => u.purchased);
    if (hasUpgrade && !state.notifications.shownMilestones.has("first-upgrade")) {
        return {
            state: markMilestoneAsShown(state, "first-upgrade"),
            notification: {
                message: "Upgrades boost your existing generators. Smart investment! ⚡",
                id: "first-upgrade"
            }
        };
    }
    return { state };
}

// Check click milestones
export function checkClickMilestones(state: GameState): { state: GameState; notification?: { message: string; id: string } } {
    if (state.notifications.totalClicks >= 100 && !state.notifications.shownMilestones.has("clicker-master")) {
        return {
            state: markMilestoneAsShown(state, "clicker-master"),
            notification: {
                message: "Clicker Master! Your dedication is admirable for clicking 100 times.",
                id: "clicker-master"
            }
        };
    }

    if (state.notifications.totalClicks >= 1000 && !state.notifications.shownMilestones.has("clicker-immortal")) {
        return {
            state: markMilestoneAsShown(state, "clicker-immortal"),
            notification: {
                message: "1,000 clicks! You have transcended mortal limits. The click gods salute you. ⚡👑",
                id: "clicker-immortal"
            }
        };
    }
    if (state.notifications.totalClicks >= 500 && !state.notifications.shownMilestones.has("clicker-expert")) {
        return {
            state: markMilestoneAsShown(state, "clicker-expert"),
            notification: {
                message: "500 clicks! You're unstoppable.",
                id: "clicker-expert"
            }
        };
    }

    if (state.notifications.totalClicks >= 50 && !state.notifications.shownMilestones.has("clicker-novice")) {
        return {
            state: markMilestoneAsShown(state, "clicker-novice"),
            notification: {
                message: "Clicker Novice! 50 clicks and counting...",
                id: "clicker-novice"
            }
        };
    }

    return { state };
}

// Calculate clicks per minute from recent clicks (5 second window)
export function calculateCPM(recentClicks: number[]): number {
    const now = Date.now();
    const fiveSecondsAgo = now - 5000; // Changed back from 1000 to 5000

    // Count clicks in the last 5 seconds
    const clicksInFiveSeconds = recentClicks.filter(timestamp => timestamp > fiveSecondsAgo).length;
    
    // Scale to clicks per minute (5 seconds * 12 = 60 seconds)
    return clicksInFiveSeconds * 12; // Changed back from * 60 to * 12
}

// Update max CPM if current CPM is higher
export function updateMaxCPM(state: GameState): GameState {
    const currentCPM = calculateCPM(state.notifications.recentClicks);
    
    if (currentCPM > (state.notifications.maxCPM || 0)) {
        return {
            ...state,
            notifications: {
                ...state.notifications,
                maxCPM: currentCPM,
            },
        };
    }
    
    return state;
}

export function incrementClickCount(state: GameState): GameState {
    const now = Date.now();
    const fiveSecondsAgo = now - 5000; // Changed back from 1000 to 5000

    // Add current click timestamp
    const updatedRecentClicks = [...state.notifications.recentClicks, now];

    // Remove clicks older than 5 seconds
    const filteredRecentClicks = updatedRecentClicks.filter(timestamp => timestamp > fiveSecondsAgo);

    const updatedState = {
        ...state,
        notifications: {
            ...state.notifications,
            totalClicks: state.notifications.totalClicks + 1,
            recentClicks: filteredRecentClicks,
        },
    };

    // Update max CPM after adding the click
    return updateMaxCPM(updatedState);
} 