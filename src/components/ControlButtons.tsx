import React from 'react';
import { GAME_CONSTANTS } from '../constants';
import { useResponsive } from '../hooks/useResponsive';
import { ResponsiveLayout } from '../utils/responsiveLayout';

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
  const responsive = useResponsive();
  const layout = new ResponsiveLayout(responsive);
  const position = layout.getControlButtonsPosition();
  
  const isDisabled = balance < GAME_CONSTANTS.ROLL_COST || isRolling || !availableToSpin;
  
  return (
    <>
      <pixiGraphics
        x={position.x}
        y={position.y}
        draw={(g) => {
          g.clear();
          g.fill(isDisabled ? 0x666666 : 0x4a90e2);
          g.rect(0, 0, responsive.layout.buttonWidth, responsive.layout.buttonHeight);
          g.fill();
          g.stroke({ color: isDisabled ? 0x999999 : 0xffffff, width: responsive.isMobile ? 1 : 2 });
          g.rect(0, 0, responsive.layout.buttonWidth, responsive.layout.buttonHeight);
          g.stroke();
        }}
        eventMode={isDisabled ? 'none' : 'static'}
        onPointerDown={isDisabled ? undefined : onRollClick}
        cursor={isDisabled ? 'default' : 'pointer'}
      />

      <pixiText
        text={"Spin"}
        x={position.x + responsive.layout.buttonWidth / 2}
        y={position.y + responsive.layout.buttonHeight / 2}
        anchor={{ x: 0.5, y: 0.5 }}
        style={{
          fontSize: responsive.fontSize.small,
          fill: isDisabled ? '#cccccc' : '#ffffff',
          fontFamily: 'Arial',
        }}
      />

      <pixiGraphics
        x={position.x + responsive.layout.buttonWidth + responsive.spacing.md}
        y={position.y}
        draw={(g) => {
          g.clear();
          g.fill(0xe74c3c);
          g.rect(0, 0, responsive.layout.buttonWidth, responsive.layout.buttonHeight);
          g.fill();
          g.stroke({ color: 0xffffff, width: responsive.isMobile ? 1 : 2 });
          g.rect(0, 0, responsive.layout.buttonWidth, responsive.layout.buttonHeight);
          g.stroke();
        }}
        eventMode='static'
        onPointerDown={onResetClick}
        cursor='pointer'
      />
      
      <pixiText
        text={"Reset"}
        x={position.x + responsive.layout.buttonWidth + responsive.spacing.md + responsive.layout.buttonWidth / 2}
        y={position.y + responsive.layout.buttonHeight / 2}
        anchor={{ x: 0.5, y: 0.5 }}
        style={{
          fontSize: responsive.fontSize.small,
          fill: '#ffffff',
          fontFamily: 'Arial',
        }}
      />
    </>
  );
};

export default ControlButtons;
