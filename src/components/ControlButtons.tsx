import React from 'react';
import { GAME_CONSTANTS } from '../constants';

interface ControlButtonsProps {
  onRollClick: () => void;
  onResetClick: () => void;
  isRolling: boolean;
  availableToSpin: boolean;
  balance: number;
}

const ControlButtons: React.FC<ControlButtonsProps> = ({ 
  onRollClick, 
  onResetClick, 
  isRolling, 
  availableToSpin,
  balance
}) => {
  const isDisabled = balance < GAME_CONSTANTS.ROLL_COST || isRolling || !availableToSpin;
  return (
    <>
      <pixiGraphics
        x={100}
        y={200}
        draw={(g) => {
          g.clear();
          g.fill(isDisabled ? 0x666666 : 0x4a90e2);
          g.rect(0, 0, 120, 40);
          g.fill();
          g.stroke({ color: isDisabled ? 0x999999 : 0xffffff, width: 2 });
          g.rect(0, 0, 120, 40);
          g.stroke();
        }}
        eventMode={isDisabled ? 'none' : 'static'}
        onPointerDown={isDisabled ? undefined : onRollClick}
        cursor={isDisabled ? 'default' : 'pointer'}
      />

      <pixiText
        text={"Spin"}
        x={160}
        y={220}
        anchor={{ x: 0.5, y: 0.5 }}
        style={{
          fontSize: 16,
          fill: isDisabled ? '#cccccc' : '#ffffff',
          fontFamily: 'Arial',
        }}
      />

      <pixiGraphics
        x={240}
        y={200}
        draw={(g) => {
          g.clear();
          g.fill(0xe74c3c);
          g.rect(0, 0, 120, 40);
          g.fill();
          g.stroke({ color: 0xffffff, width: 2 });
          g.rect(0, 0, 120, 40);
          g.stroke();
        }}
        eventMode='static'
        onPointerDown={onResetClick}
        cursor='pointer'
      />
      
      <pixiText
        text={"Reset"}
        x={300}
        y={220}
        anchor={{ x: 0.5, y: 0.5 }}
        style={{
          fontSize: 16,
          fill: '#ffffff',
          fontFamily: 'Arial',
        }}
      />
    </>
  );
};

export default ControlButtons;
