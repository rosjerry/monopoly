import React from 'react';
import { GAME_CONSTANTS } from '../constants';
import { useResponsive } from '../hooks/useResponsive';
import { ResponsiveLayout } from '../utils/responsiveLayout';
import GradientButton from './GradientButton';

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
      <GradientButton
        text="Spin"
        onClick={onRollClick}
        disabled={isDisabled}
        x={position.x}
        y={position.y}
        gradientColors={[0x4a90e2, 0x357abd]} // Blue gradient
        textColor="#ffffff"
      />

      <GradientButton
        text="Reset"
        onClick={onResetClick}
        disabled={false}
        x={position.x + 120 + responsive.styles.spacing.md}
        y={position.y}
        gradientColors={[0xe74c3c, 0xc0392b]} // Red gradient
        textColor="#ffffff"
      />
    </>
  );
};

export default ControlButtons;