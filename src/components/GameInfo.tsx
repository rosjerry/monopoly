import React from 'react';
import { useResponsive } from '../hooks/useResponsive';
import { ResponsiveLayout } from '../utils/responsiveLayout';
import { gameStyles } from '../config/gameStyles';
import { GAME_CONSTANTS } from '../constants';
import AnimatedText from './AnimatedText';

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
      {board && (
        <AnimatedText
          text={`Current Square: ${board[currentIndex]}`}
          x={position.x}
          y={position.y}
          size="md"
          color={gameStyles.colors.ui.text.primary}
          weight="bold"
          animated={true}
          animationType="pulse"
          anchor={{ x: 0, y: 0.5 }}
        />
      )}
      
      <AnimatedText
        text={`Spin Cost: ${GAME_CONSTANTS.ROLL_COST}`}
        x={position.x}
        y={position.y + 30}
        size="sm"
        color={gameStyles.colors.ui.text.secondary}
        weight="normal"
        animated={false}
        anchor={{ x: 0, y: 0.5 }}
      />
    </>
  );
};

export default GameInfo;