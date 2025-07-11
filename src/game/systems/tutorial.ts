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
export const shouldActivateTutorial = (tutorialState: TutorialState, gameState: GameState): boolean => {
  // Activate tutorial when in intro level and no steps completed yet
  return gameState.currentLevelId === 0 && tutorialState.completedSteps.size === 0;
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
export const updateTutorial = (tutorialState: TutorialState, gameState: GameState): TutorialState => {
  let newTutorialState = { ...tutorialState };

  // Start tutorial if conditions are met
  if (shouldActivateTutorial(newTutorialState, gameState)) {
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

// Force complete tutorial when transitioning from intro level
export const forceCompleteTutorial = (tutorialState: TutorialState): TutorialState => {
  if (!tutorialState.isActive) return tutorialState;
  
  return {
    ...tutorialState,
    isActive: false,
    currentStep: null,
    completedSteps: new Set(['click-blob', 'first-evolution']), // Mark all intro steps as completed
  };
};

// Progress tutorial based on a game event
export function progressTutorial(
  tutorialState: TutorialState,
  event: 'manualClick' | 'buyGenerator' | 'evolve'
): TutorialState {
  if (!tutorialState.isActive || !tutorialState.currentStep) return tutorialState;

  // If evolving from intro level, force complete the tutorial
  if (event === 'evolve' && tutorialState.currentStep.type === 'click-blob') {
    return forceCompleteTutorial(tutorialState);
  }

  // Progression logic for each step
  switch (tutorialState.currentStep.type) {
    case 'click-blob':
      if (event === 'manualClick') {
        return completeTutorialStep(tutorialState, 'click-blob');
      }
      break;
    case 'buy-generator':
      if (event === 'buyGenerator') {
        return completeTutorialStep(tutorialState, 'buy-first-generator');
      }
      break;
    case 'evolve':
      if (event === 'evolve') {
        return completeTutorialStep(tutorialState, 'first-evolution');
      }
      break;
    default:
      break;
  }
  return tutorialState;
} 