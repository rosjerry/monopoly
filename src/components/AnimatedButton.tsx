import React, { useRef } from 'react';
import { createEnhancedButtonStyle } from '../config/enhancedStyles';
import { animateButtonHover, animateButtonClick } from '../utils/animations';

interface AnimatedButtonProps {
  text: string;
  onClick: () => void;
  type?: 'primary' | 'secondary' | 'danger' | 'success';
  disabled?: boolean;
  x: number;
  y: number;
  animated?: boolean;
}

const AnimatedButton: React.FC<AnimatedButtonProps> = ({
  text,
  onClick,
  type = 'primary',
  disabled = false,
  x,
  y,
  animated = true,
}) => {
  const buttonRef = useRef<any>(null);
  const isHoveringRef = useRef(false);

  const buttonStyle = createEnhancedButtonStyle(type, disabled);

  const handlePointerOver = () => {
    if (disabled || !animated) return;
    isHoveringRef.current = true;
    animateButtonHover(buttonRef.current, true);
  };

  const handlePointerOut = () => {
    if (disabled || !animated) return;
    isHoveringRef.current = false;
    animateButtonHover(buttonRef.current, false);
  };

  const handlePointerDown = () => {
    if (disabled) return;
    if (animated) {
      animateButtonClick(buttonRef.current);
    }
    onClick();
  };

  return (
    <>
      <pixiGraphics
        ref={buttonRef}
        x={x}
        y={y}
        draw={(g) => {
          g.clear();
          
          // Draw main button
          g.fill(buttonStyle.fill);
          g.rect(0, 0, buttonStyle.width, buttonStyle.height);
          g.fill();
          
          // Draw border
          g.stroke({ color: buttonStyle.stroke, width: buttonStyle.strokeWidth });
          g.rect(0, 0, buttonStyle.width, buttonStyle.height);
          g.stroke();
        }}
        eventMode={disabled ? 'none' : 'static'}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
        onPointerDown={handlePointerDown}
        cursor={disabled ? 'default' : 'pointer'}
      />

      <pixiText
        text={text}
        x={x + buttonStyle.width / 2}
        y={y + buttonStyle.height / 2}
        anchor={{ x: 0.5, y: 0.5 }}
        style={{
          fontSize: 16,
          fill: '#ffffff',
          fontFamily: 'Arial, sans-serif',
          fontWeight: 'bold',
        }}
      />
    </>
  );
};

export default AnimatedButton;