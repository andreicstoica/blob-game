import type { TutorialState, TutorialStep } from '../types/ui';
import type { GameState } from '../types/core';

// Tutorial step definitions
export const TUTORIAL_STEPS: Record<string, Omit<TutorialStep, 'completed'>> = {
  'click-blob': {
    id: 'click-blob',
    type: 'click-blob',
  },
  // Future tutorial steps can be added here
  'buy-first-generator': {
    id: 'buy-first-generator', 
    type: 'buy-generator',
  },
  'first-evolution': {
    id: 'first-evolution',
    type: 'evolve',
  },
};

// Initialize tutorial state
export const createTutorialState = (): TutorialState => ({
  currentStep: null,
  completedSteps: new Set<string>(),
  isActive: false,
});

// Check if tutorial should be active based on game state
export const shouldActivateTutorial = (gameState: GameState): boolean => {
  // Activate tutorial when in intro level and no steps completed yet
  return gameState.currentLevelId === 0 && gameState.tutorial.completedSteps.size === 0;
};

// Start the tutorial system
export const startTutorial = (tutorialState: TutorialState): TutorialState => {
  if (tutorialState.isActive) return tutorialState;
  
  return {
    ...tutorialState,
    isActive: true,
    currentStep: {
      ...TUTORIAL_STEPS['click-blob'],
      completed: false,
    },
  };
};

// Complete the current tutorial step
export const completeTutorialStep = (
  tutorialState: TutorialState,
  stepId: string
): TutorialState => {
  if (!tutorialState.currentStep || tutorialState.currentStep.id !== stepId) {
    return tutorialState;
  }

  const newCompletedSteps = new Set(tutorialState.completedSteps);
  newCompletedSteps.add(stepId);

  // For now, just complete the tutorial after the first step
  // Later we can add logic to progress to next steps
  return {
    ...tutorialState,
    currentStep: null,
    completedSteps: newCompletedSteps,
    isActive: false,
  };
};

// Check if a specific tutorial step is completed
export const isTutorialStepCompleted = (
  tutorialState: TutorialState,
  stepId: string
): boolean => {
  return tutorialState.completedSteps.has(stepId);
};

// Get the current active tutorial step
export const getCurrentTutorialStep = (tutorialState: TutorialState): TutorialStep | null => {
  return tutorialState.currentStep;
};

// Update tutorial based on game state changes
export const updateTutorial = (gameState: GameState): TutorialState => {
  let newTutorialState = { ...gameState.tutorial };

  // Start tutorial if conditions are met
  if (shouldActivateTutorial(gameState)) {
    newTutorialState = startTutorial(newTutorialState);
  }

  // Deactivate tutorial if player has progressed past intro level
  if (gameState.currentLevelId > 0 && newTutorialState.isActive) {
    newTutorialState = {
      ...newTutorialState,
      isActive: false,
      currentStep: null,
    };
  }

  return newTutorialState;
}; 