import React from 'react';

interface GameInfoProps {
  board: (string | number)[] | null;
  currentIndex: number;
  isMockMode: boolean;
}

const GameInfo: React.FC<GameInfoProps> = ({ board, currentIndex, isMockMode }) => {
  return (
    <>
      {/* Board Mode Display */}
      <pixiText
        text={`Board Mode: ${isMockMode ? 'Mock' : 'Real'}`}
        x={300}
        y={170}
        anchor={{ x: 0, y: 0.5 }}
        style={{
          fontSize: 14,
          fill: isMockMode ? '#00ff00' : '#ff6b6b',
          fontFamily: 'Arial',
        }}
      />

      {/* Selected Cell Display */}
      {board && (
        <pixiText
          text={`Current Square: ${board[currentIndex]}`}
          x={300}
          y={140}
          anchor={{ x: 0, y: 0.5 }}
          style={{
            fontSize: 16,
            fill: '#ffffff',
            fontFamily: 'Arial',
            fontWeight: 'bold',
          }}
        />
      )}
    </>
  );
};

export default GameInfo;
