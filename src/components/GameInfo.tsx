import React from 'react';
import { useResponsive } from '../hooks/useResponsive';
import { ResponsiveLayout } from '../utils/responsiveLayout';

interface GameInfoProps {
  board: (string | number)[] | null;
  currentIndex: number;
  isMockMode: boolean;
}

const GameInfo: React.FC<GameInfoProps> = ({ board, currentIndex, isMockMode }) => {
  const responsive = useResponsive();
  const layout = new ResponsiveLayout(responsive);
  const position = layout.getGameInfoPosition();
  
  return (
    <>
      <pixiText
        text={`Board Mode: ${isMockMode ? 'Mock' : 'Real'}`}
        x={position.x}
        y={position.y + responsive.spacing.md}
        anchor={{ x: 0, y: 0.5 }}
        style={{
          fontSize: responsive.fontSize.small,
          fill: isMockMode ? '#00ff00' : '#ff6b6b',
          fontFamily: 'Arial',
        }}
      />

      {board && (
        <pixiText
          text={`Current Square: ${board[currentIndex]}`}
          x={position.x}
          y={position.y}
          anchor={{ x: 0, y: 0.5 }}
          style={{
            fontSize: responsive.fontSize.small,
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
