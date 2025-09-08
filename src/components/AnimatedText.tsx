import React, { useRef, useEffect } from 'react';
import { animateTextColorChange, animateTextPulse, animateTextBounce } from '../utils/animations';

interface AnimatedTextProps {
  text: string;
  x: number;
  y: number;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl';
  color?: string;
  weight?: 'normal' | 'bold';
  animated?: boolean;
  animationType?: 'colorChange' | 'pulse' | 'bounce' | 'none';
  anchor?: { x: number; y: number };
}

const AnimatedText: React.FC<AnimatedTextProps> = ({
  text,
  x,
  y,
  size = 'md',
  color = '#ffffff',
  weight = 'normal',
  animated = false,
  animationType = 'none',
  anchor = { x: 0.5, y: 0.5 },
}) => {
  const textRef = useRef<any>(null);
  const animationRef = useRef<any>(null);

  const fontSizeMap = {
    xs: 14,
    sm: 16,
    md: 20,
    lg: 24,
    xl: 28,
    xxl: 32,
  };

  useEffect(() => {
    // Stop any existing animations and reset properties
    if (animationRef.current) {
      animationRef.current.kill();
      animationRef.current = null;
    }

    // Reset scale and other transform properties
    if (textRef.current) {
      textRef.current.scale.set(1);
      textRef.current.alpha = 1;
    }

    if (!animated || !textRef.current) return;

    switch (animationType) {
      case 'colorChange':
        const colors = ['#ffffff', '#ffd700', '#ff6b6b', '#4ecdc4', '#45b7d1'];
        animationRef.current = animateTextColorChange(textRef.current, colors);
        break;
      case 'pulse':
        animationRef.current = animateTextPulse(textRef.current);
        break;
      case 'bounce':
        animationRef.current = animateTextBounce(textRef.current);
        break;
      default:
        break;
    }

    return () => {
      if (animationRef.current) {
        animationRef.current.kill();
        animationRef.current = null;
      }
      // Reset properties when component unmounts or animation changes
      if (textRef.current) {
        textRef.current.scale.set(1);
        textRef.current.alpha = 1;
      }
    };
  }, [animated, animationType]);

  return (
    <pixiText
      ref={textRef}
      text={text}
      x={x}
      y={y}
      anchor={anchor}
      style={{
        fontSize: fontSizeMap[size],
        fill: color,
        fontFamily: 'Arial, sans-serif',
        fontWeight: weight,
      }}
    />
  );
};

export default AnimatedText;