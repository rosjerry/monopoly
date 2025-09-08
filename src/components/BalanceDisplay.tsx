import React from 'react';
import { useResponsive } from '../hooks/useResponsive';
import { ResponsiveLayout } from '../utils/responsiveLayout';

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
      <pixiText
        text={`Balance: ${balance}`}
        x={position.x}
        y={position.y}
        anchor={{ x: 0, y: 0.5 }}
        style={{
          fontSize: responsive.fontSize.medium,
          fill: '#00e676',
          fontFamily: 'Arial',
          fontWeight: 'bold',
        }}
      />

      {balanceDelta && (
        <pixiText
          text={`${balanceDelta.value > 0 ? '+' : ''}${balanceDelta.value}`}
          x={position.x + 150}
          y={position.y}
          anchor={{ x: 0, y: 0.5 }}
          style={{
            fontSize: responsive.fontSize.small,
            fill: balanceDelta.color,
            fontFamily: 'Arial',
            fontWeight: 'bold',
          }}
        />
      )}
    </>
  );
};

export default BalanceDisplay;
