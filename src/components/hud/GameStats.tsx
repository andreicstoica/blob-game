import React, { useState, useEffect } from "react";
import type { GameState } from "../../game/types";
import { NumberFormatter } from "../../utils/numberFormat";
import { GAME_CONFIG } from "../../game/content/config";
import { Colors } from "../../styles/colors";
import { calculateCPM } from "../../game/systems/notifications";

interface GameStatsProps {
  biomass: number;
  gameState?: GameState;
}

export const GameStats: React.FC<GameStatsProps> = ({ biomass, gameState }) => {
  const [gameTime, setGameTime] = useState(0);
  
  // Track game time
  useEffect(() => {
    const interval = setInterval(() => {
      setGameTime(prev => prev + 1);
    }, 1000);
    
    return () => clearInterval(interval);
  }, []);

  const formattedBiomass = NumberFormatter.biomass(biomass, gameState);
  const biomassLength = formattedBiomass.length;

  // Calculate CPM
  const cpm = gameState
    ? calculateCPM(gameState.notifications.recentClicks)
    : 0;

  // Format time as MM:SS
  // const formatTime = (seconds: number) => {
  //   const mins = Math.floor(seconds / 60);
  //   const secs = seconds % 60;
  //   return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  // };

  // Dynamic font size based on biomass length to ensure it fits
  let fontSize = 72;
  if (biomassLength > 8) fontSize = 54;
  if (biomassLength > 12) fontSize = 42;
  if (biomassLength > 16) fontSize = 36;

  // Scale padding based on biomass number length: Base 20px, add 5px for each character beyond 3
  const horizontalPadding = Math.max(20, 20 + (biomassLength - 3) * 5);

  return (
    <div
      style={{
        textAlign: "center",
        minHeight: "80px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        width: "fit-content",
        minWidth: "200px",
        maxWidth: "none",
        backgroundColor: "rgba(0, 0, 0, 0.4)",
        padding: `20px ${horizontalPadding}px`,
        borderRadius: "0 0 18px 18px",
        color: "white",
        fontFamily: "Arial, sans-serif",
        userSelect: "none",
      }}
    >
      {/* Timer and Click Count Row */}
      {/* 
      <div
        style={{
          display: "flex",
          justifyContent: "space-around",
          alignItems: "center",
          gap: "15px",
          marginBottom: "15px",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <div
            style={{
              fontSize: "12px",
              opacity: 0.7,
              marginBottom: "3px",
              fontWeight: "bold",
            }}
          >
            TIME
          </div>
          <div
            style={{
              fontSize: "16px",
              fontWeight: "bold",
              color: Colors.evolution.primary,
              marginBottom: "5px",
            }}
          >
            {formatTime(gameTime)}
          </div>
        </div>

        <div
          style={{
            width: "1px",
            height: "30px",
            backgroundColor: "rgba(255, 255, 255, 0.2)",
          }}
        />

        <div style={{ textAlign: "center" }}>
          <div
            style={{
              fontSize: "12px",
              opacity: 0.7,
              marginBottom: "3px",
              fontWeight: "bold",
            }}
          >
            CLICKS
          </div>
          <div
            style={{
              fontSize: "16px",
              fontWeight: "bold",
              color: Colors.evolution.primary,
              marginBottom: "5px",
            }}
          >
            {gameState?.notifications.totalClicks || 0}
          </div>
        </div>
      </div>
      */}

      {/* Main Biomass Display */}
      <div style={{ marginBottom: "15px" }}>
        <div
          style={{
            fontSize: "16px",
            opacity: 0.8,
            marginBottom: "5px",
            fontWeight: "bold",
          }}
        >
          BIOMASS
        </div>
        <div
          style={{
            fontSize: `${fontSize}px`,
            fontWeight: "bold",
            color: Colors.biomass.primary,
            textShadow: `0 0 20px ${Colors.biomass.primary}80`,
            lineHeight: "1",
            padding: "0 10px",
            whiteSpace: "nowrap",
            overflow: "visible",
            minWidth: "0",
            flexShrink: 1,
          }}
        >
          {formattedBiomass}
        </div>
      </div>

      {/* Growth, Click Power, and CPM Row */}
      {gameState && (
        <div
          style={{
            display: "flex",
            justifyContent: "space-around",
            alignItems: "center",
            gap: "15px",
          }}
        >
          <div style={{ textAlign: "center" }}>
            <div
              style={{
                fontSize: "12px",
                opacity: 0.7,
                marginBottom: "3px",
                fontWeight: "bold",
              }}
            >
              GROWTH
            </div>
            <div
              style={{
                fontSize: "16px",
                fontWeight: "bold",
                color: Colors.biomass.primary,
                marginBottom: "5px",
              }}
            >
              {NumberFormatter.rate(
                gameState.growth * (1000 / GAME_CONFIG.tickRate),
                gameState
              )}
              <span style={{ fontSize: "12px", color: "white", opacity: 0.7 }}>
                {" "}
                / sec
              </span>
            </div>
          </div>

          <div
            style={{
              width: "1px",
              height: "30px",
              backgroundColor: "rgba(255, 255, 255, 0.2)",
            }}
          />

          <div style={{ textAlign: "center" }}>
            <div
              style={{
                fontSize: "12px",
                opacity: 0.7,
                marginBottom: "3px",
                fontWeight: "bold",
              }}
            >
              CLICK PWR
            </div>
            <div
              style={{
                fontSize: "16px",
                fontWeight: "bold",
                color: Colors.biomass.primary,
                marginBottom: "5px",
              }}
            >
              {NumberFormatter.power(gameState.clickPower, gameState)}
            </div>
          </div>

          <div
            style={{
              width: "1px",
              height: "30px",
              backgroundColor: "rgba(255, 255, 255, 0.2)",
            }}
          />

          <div style={{ textAlign: "center" }}>
            <div
              style={{
                fontSize: "12px",
                opacity: 0.7,
                marginBottom: "2px",
                fontWeight: "bold",
              }}
            >
              CLICKS / SEC
            </div>
            <div
              style={{
                fontSize: "18px",
                fontWeight: "bold",
                color: Colors.biomass.primary,
                marginBottom: "5px",
              }}
            >
              {gameTime < 30 ? "-" : Math.round(cpm / 60)}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
