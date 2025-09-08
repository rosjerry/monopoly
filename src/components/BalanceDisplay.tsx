import React from 'react';

interface BalanceDisplayProps {
  balance: number;
  balanceDelta: { value: number; color: string } | null;
}

const BalanceDisplay: React.FC<BalanceDisplayProps> = ({ balance, balanceDelta }) => {
  return (
    <>
      <pixiText
        text={`Balance: ${balance}`}
        x={100}
        y={80}
        anchor={{ x: 0, y: 0.5 }}
        style={{
          fontSize: 22,
          fill: '#00e676',
          fontFamily: 'Arial',
          fontWeight: 'bold',
        }}
      />

      {balanceDelta && (
        <pixiText
          text={`${balanceDelta.value > 0 ? '+' : ''}${balanceDelta.value}`}
          x={250}
          y={80}
          anchor={{ x: 0, y: 0.5 }}
          style={{
            fontSize: 20,
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
