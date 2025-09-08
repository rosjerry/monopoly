import React from 'react';
import { GAME_CONSTANTS } from '../constants';
import { useResponsive } from '../hooks/useResponsive';
import { ResponsiveLayout } from '../utils/responsiveLayout';
import { gameStyles } from '../config/gameStyles';
import { createTextStyle, createButtonStyle, createDisabledButtonStyle } from '../config/responsiveStyles';

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
  
  // Create button styles
  const spinButtonStyle = isDisabled 
    ? createDisabledButtonStyle(responsive.styles)
    : createButtonStyle(responsive.styles, 'primary');
  
  const resetButtonStyle = createButtonStyle(responsive.styles, 'danger');
  
  // Create text styles
  const spinTextStyle = createTextStyle(
    responsive.styles, 
    'sm', 
    isDisabled ? gameStyles.colors.ui.text.disabled : gameStyles.colors.ui.text.primary
  );
  
  const resetTextStyle = createTextStyle(responsive.styles, 'sm', gameStyles.colors.ui.text.primary);
  
  return (
    <>
      <pixiGraphics
        x={position.x}
        y={position.y}
        draw={(g) => {
          g.clear();
          g.fill(spinButtonStyle.fill);
          g.rect(0, 0, spinButtonStyle.width, spinButtonStyle.height);
          g.fill();
          g.stroke({ color: spinButtonStyle.stroke, width: spinButtonStyle.strokeWidth });
          g.rect(0, 0, spinButtonStyle.width, spinButtonStyle.height);
          g.stroke();
        }}
        eventMode={isDisabled ? 'none' : 'static'}
        onPointerDown={isDisabled ? undefined : onRollClick}
        cursor={isDisabled ? 'default' : 'pointer'}
      />

      <pixiText
        text={"Spin"}
        x={position.x + spinButtonStyle.width / 2}
        y={position.y + spinButtonStyle.height / 2}
        anchor={{ x: 0.5, y: 0.5 }}
        style={spinTextStyle}
      />

      <pixiGraphics
        x={position.x + spinButtonStyle.width + responsive.styles.spacing.md}
        y={position.y}
        draw={(g) => {
          g.clear();
          g.fill(resetButtonStyle.fill);
          g.rect(0, 0, resetButtonStyle.width, resetButtonStyle.height);
          g.fill();
          g.stroke({ color: resetButtonStyle.stroke, width: resetButtonStyle.strokeWidth });
          g.rect(0, 0, resetButtonStyle.width, resetButtonStyle.height);
          g.stroke();
        }}
        eventMode='static'
        onPointerDown={onResetClick}
        cursor='pointer'
      />
      
      <pixiText
        text={"Reset"}
        x={position.x + spinButtonStyle.width + responsive.styles.spacing.md + resetButtonStyle.width / 2}
        y={position.y + resetButtonStyle.height / 2}
        anchor={{ x: 0.5, y: 0.5 }}
        style={resetTextStyle}
      />
    </>
  );
};

export default ControlButtons;
