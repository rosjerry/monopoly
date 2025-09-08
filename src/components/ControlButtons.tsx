import React from 'react';

interface ControlButtonsProps {
  onRollClick: () => void;
  onResetClick: () => void;
  isRolling: boolean;
  availableToSpin: boolean;
}

const ControlButtons: React.FC<ControlButtonsProps> = ({ 
  onRollClick, 
  onResetClick, 
  isRolling, 
  availableToSpin 
}) => {
  return (
    <>
      {/* Dice Roll Button */}
      <pixiGraphics
        x={100}
        y={200}
        draw={(g) => {
          g.clear();
          g.fill(0x4a90e2);
          g.rect(0, 0, 120, 40);
          g.fill();
          g.stroke({ color: 0xffffff, width: 2 });
          g.rect(0, 0, 120, 40);
          g.stroke();
        }}
        eventMode='static'
        onPointerDown={onRollClick}
        cursor='pointer'
      />

      <pixiText
        text={"Roll dice"}
        x={160}
        y={220}
        anchor={{ x: 0.5, y: 0.5 }}
        style={{
          fontSize: 16,
          fill: '#ffffff',
          fontFamily: 'Arial',
        }}
      />

      {/* Reset Button */}
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
