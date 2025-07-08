import React from 'react';
import type { GameState } from '../../engine/game';
import { getCurrentLevel, getNextLevel, canEvolveToNextLevel } from '../../engine/game';
import { formatBiomass } from '../../engine/levels';

interface EvolutionPanelProps {
    biomass: number;
    gameState?: GameState;
    onEvolve?: () => void;
}

export const EvolutionPanel: React.FC<EvolutionPanelProps> = ({ 
    biomass, 
    gameState, 
    onEvolve 
}) => {
    if (!gameState) return null;

    const currentLevel = getCurrentLevel(gameState);
    const nextLevel = getNextLevel(gameState);
    const canEvolve = canEvolveToNextLevel(gameState);

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            right: 0,
            width: '300px',
            height: '100vh',
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            color: 'white',
            fontFamily: 'Arial, sans-serif',
            padding: '20px',
            overflowY: 'auto',
            zIndex: 1000
        }}>
            <h2 style={{
                margin: '0 0 20px 0',
                fontSize: '24px',
                color: '#4ade80',
                textAlign: 'center'
            }}>
                Evolution
            </h2>

            <div style={{
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                padding: '15px',
                borderRadius: '8px',
                marginBottom: '20px'
            }}>
                <h3 style={{
                    margin: '0 0 10px 0',
                    fontSize: '18px',
                    color: '#4ade80'
                }}>
                    Current Level: {currentLevel.name}
                </h3>
                <p style={{
                    margin: '0',
                    fontSize: '14px',
                    opacity: 0.8
                }}>
                    {currentLevel.description}
                </p>
            </div>

            {nextLevel && (
                <div style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    padding: '15px',
                    borderRadius: '8px',
                    marginBottom: '20px'
                }}>
                    <h3 style={{
                        margin: '0 0 10px 0',
                        fontSize: '18px',
                        color: '#4ade80'
                    }}>
                        Next Evolution: {nextLevel.name}
                    </h3>
                    <p style={{
                        margin: '0 0 15px 0',
                        fontSize: '14px',
                        opacity: 0.8
                    }}>
                        {nextLevel.description}
                    </p>
                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: '10px'
                    }}>
                        <span style={{ fontSize: '14px' }}>Required Biomass:</span>
                        <span style={{ 
                            fontSize: '16px', 
                            fontWeight: 'bold',
                            color: canEvolve ? '#4ade80' : '#ef4444'
                        }}>
                            {formatBiomass(nextLevel.biomassThreshold, nextLevel.biomassDisplayFormat)}
                        </span>
                    </div>
                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                    }}>
                        <span style={{ fontSize: '14px' }}>Your Biomass:</span>
                        <span style={{ 
                            fontSize: '16px', 
                            fontWeight: 'bold',
                            color: canEvolve ? '#4ade80' : '#ef4444'
                        }}>
                            {formatBiomass(biomass, currentLevel.biomassDisplayFormat)}
                        </span>
                    </div>
                </div>
            )}

            <button
                onClick={onEvolve}
                disabled={!canEvolve}
                style={{
                    width: '100%',
                    padding: '15px',
                    fontSize: '16px',
                    fontWeight: 'bold',
                    backgroundColor: canEvolve ? '#4ade80' : '#374151',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: canEvolve ? 'pointer' : 'not-allowed',
                    opacity: canEvolve ? 1 : 0.5,
                    transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                    if (canEvolve) {
                        e.currentTarget.style.backgroundColor = '#22c55e';
                    }
                }}
                onMouseLeave={(e) => {
                    if (canEvolve) {
                        e.currentTarget.style.backgroundColor = '#4ade80';
                    }
                }}
            >
                {canEvolve ? 'Evolve!' : 'Not Ready'}
            </button>

            {!nextLevel && (
                <div style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    padding: '15px',
                    borderRadius: '8px',
                    marginTop: '20px',
                    textAlign: 'center'
                }}>
                    <p style={{
                        margin: '0',
                        fontSize: '14px',
                        color: '#4ade80'
                    }}>
                        🏆 You've reached the maximum evolution level! There are no more universes to conquer.
                    </p>
                </div>
            )}
        </div>
    );
}; 