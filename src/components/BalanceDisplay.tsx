import React from 'react';
import { useResponsive } from '../hooks/useResponsive';
import { ResponsiveLayout } from '../utils/responsiveLayout';
import { gameStyles } from '../config/gameStyles';
import AnimatedText from './AnimatedText';

interface BalanceDisplayProps {
  balance: number;
  balanceDelta: { value: number; color: string } | null;
}

const BalanceDisplay: React.FC<BalanceDisplayProps> = ({ balance, balanceDelta }) => {
  const responsive = useResponsive();
  const layout = new ResponsiveLayout(responsive);
  const position = layout.getBalancePosition();
  
  return (
    <>
      <AnimatedText
        text={`Balance: ${balance}`}
        x={position.x}
        y={position.y}
        size="lg"
        color={gameStyles.colors.game.balance.positive}
        weight="bold"
        animated={true}
        animationType="pulse"
        anchor={{ x: 0, y: 0.5 }}
      />

      {balanceDelta && (
        <AnimatedText
          text={`${balanceDelta.value > 0 ? '+' : ''}${balanceDelta.value}`}
          x={position.x + 200}
          y={position.y}
          size="md"
          color={balanceDelta.color}
          weight="bold"
          animated={true}
          animationType="bounce"
          anchor={{ x: 0, y: 0.5 }}
        />
      )}
    </>
  );
};

export default BalanceDisplay;