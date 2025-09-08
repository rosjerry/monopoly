import React from 'react';
import { useResponsive } from '../hooks/useResponsive';
import { ResponsiveLayout } from '../utils/responsiveLayout';
import { gameStyles } from '../config/gameStyles';
import { createTextStyle } from '../config/responsiveStyles';

interface GameInfoProps {
  board: (string | number)[] | null;
  currentIndex: number;
  isMockMode: boolean;
}

const GameInfo: React.FC<GameInfoProps> = ({ board, currentIndex, isMockMode }) => {
  const responsive = useResponsive();
  const layout = new ResponsiveLayout(responsive);
  const position = layout.getGameInfoPosition();
  
  const modeTextStyle = createTextStyle(
    responsive.styles, 
    'sm', 
    isMockMode ? gameStyles.colors.game.mode.mock : gameStyles.colors.game.mode.live
  );
  
  const currentSquareTextStyle = createTextStyle(responsive.styles, 'sm', gameStyles.colors.ui.text.primary, 'bold');
  
  return (
    <>
      <pixiText
        text={`Board Mode: ${isMockMode ? 'Mock' : 'Real'}`}
        x={position.x}
        y={position.y + responsive.styles.spacing.md}
        anchor={{ x: 0, y: 0.5 }}
        style={modeTextStyle}
      />

      {board && (
        <pixiText
          text={`Current Square: ${board[currentIndex]}`}
          x={position.x}
          y={position.y}
          anchor={{ x: 0, y: 0.5 }}
          style={currentSquareTextStyle}
        />
      )}
    </>
  );
};

export default GameInfo;
