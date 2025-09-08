import React from 'react';
import { useResponsive } from '../hooks/useResponsive';
import { ResponsiveLayout } from '../utils/responsiveLayout';
import { gameStyles } from '../config/gameStyles';
import { createTextStyle } from '../config/responsiveStyles';

interface BalanceDisplayProps {
  balance: number;
  balanceDelta: { value: number; color: string } | null;
}

const BalanceDisplay: React.FC<BalanceDisplayProps> = ({ balance, balanceDelta }) => {
  const responsive = useResponsive();
  const layout = new ResponsiveLayout(responsive);
  const position = layout.getBalancePosition();
  
  const balanceTextStyle = createTextStyle(responsive.styles, 'md', gameStyles.colors.game.balance.positive, 'bold');
  const deltaTextStyle = balanceDelta 
    ? createTextStyle(responsive.styles, 'sm', balanceDelta.color, 'bold')
    : null;
  
  return (
    <>
      <pixiText
        text={`Balance: ${balance}`}
        x={position.x}
        y={position.y}
        anchor={{ x: 0, y: 0.5 }}
        style={balanceTextStyle}
      />

      {balanceDelta && deltaTextStyle && (
        <pixiText
          text={`${balanceDelta.value > 0 ? '+' : ''}${balanceDelta.value}`}
          x={position.x + 150}
          y={position.y}
          anchor={{ x: 0, y: 0.5 }}
          style={deltaTextStyle}
        />
      )}
    </>
  );
};

export default BalanceDisplay;
