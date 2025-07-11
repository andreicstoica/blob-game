import type { TutorialState, TutorialStep } from '../types/ui';
import type { GameState } from '../types/core';

// Tutorial step definitions
export const TUTORIAL_STEPS: Record<string, Omit<TutorialStep, 'completed'>> = {
  'click-blob': {
    id: 'click-blob',
    type: 'click-blob',
  },
  'shop-intro': {
    id: 'shop-intro',
    type: 'shop-intro',
    popupPosition: 'shop',
    popupMessage: 'Spend Biomass in the Shop:\n\nGenerators function as auto-clickers,\n\nUpgrades make Generators stronger!'
  },
  'evolution-intro': {
    id: 'evolution-intro',
    type: 'evolution-intro',
    popupPosition: 'evolution',
    popupMessage: 'Growing your Biomass unlocks Evolutions.\n\nHow far can you go?'
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

  // Progress to next step based on current step
  let nextStep: TutorialStep | null = null;
  
  switch (stepId) {
    case 'click-blob':
      nextStep = {
        ...TUTORIAL_STEPS['shop-intro'],
        completed: false,
      };
      break;
    case 'shop-intro':
      // Progress to evolution-intro step after popup is clicked
      nextStep = {
        ...TUTORIAL_STEPS['evolution-intro'],
        completed: false,
      };
      break;
    case 'evolution-intro':
      // Wait for user to evolve
      break;
    default:
      break;
  }

  return {
    ...tutorialState,
    currentStep: nextStep,
    completedSteps: newCompletedSteps,
    isActive: nextStep !== null,
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
    case 'shop-intro':
      // This step is completed by buying a generator or upgrade
      if (event === 'buyGenerator') {
        // Mark shop-intro as completed but stay on this step until evolution popup
        const newCompletedSteps = new Set(tutorialState.completedSteps);
        newCompletedSteps.add('shop-intro');
        
        return {
          ...tutorialState,
          completedSteps: newCompletedSteps,
          currentStep: {
            ...TUTORIAL_STEPS['evolution-intro'],
            completed: false,
          },
        };
      }
      break;
    case 'evolution-intro':
      // This step is completed by clicking the popup, not by game events
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