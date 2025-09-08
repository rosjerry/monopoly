import React from 'react';

interface GradientButtonProps {
  text: string;
  onClick: () => void;
  disabled?: boolean;
  x: number;
  y: number;
  gradientColors: [number, number]; // [startColor, endColor]
  textColor?: string;
}

const GradientButton: React.FC<GradientButtonProps> = ({
  text,
  onClick,
  disabled = false,
  x,
  y,
  gradientColors,
  textColor = '#ffffff',
}) => {
  const handleClick = () => {
    if (!disabled) {
      onClick();
    }
  };

  return (
    <>
      <pixiGraphics
        x={x}
        y={y}
        draw={(g) => {
          g.clear();
          
          // Create gradient effect by drawing multiple rectangles with different colors
          const width = 120;
          const height = 40;
          const steps = 20;
          
          for (let i = 0; i < steps; i++) {
            const ratio = i / (steps - 1);
            const color = interpolateColor(gradientColors[0], gradientColors[1], ratio);
            
            g.fill(color);
            g.rect(0, i * (height / steps), width, height / steps);
            g.fill();
          }
          
          // Draw border
          g.stroke({ color: 0xffffff, width: 2 });
          g.rect(0, 0, width, height);
          g.stroke();
        }}
        eventMode={disabled ? 'none' : 'static'}
        onPointerDown={handleClick}
        cursor={disabled ? 'default' : 'pointer'}
        alpha={disabled ? 0.5 : 1}
      />

      <pixiText
        text={text}
        x={x + 60} // Center of button (120/2)
        y={y + 20} // Center of button (40/2)
        anchor={{ x: 0.5, y: 0.5 }}
        style={{
          fontSize: 16,
          fill: textColor,
          fontFamily: 'Arial, sans-serif',
          fontWeight: 'bold',
        }}
      />
    </>
  );
};

// Helper function to interpolate between two colors
const interpolateColor = (color1: number, color2: number, ratio: number): number => {
  const r1 = (color1 >> 16) & 0xff;
  const g1 = (color1 >> 8) & 0xff;
  const b1 = color1 & 0xff;
  
  const r2 = (color2 >> 16) & 0xff;
  const g2 = (color2 >> 8) & 0xff;
  const b2 = color2 & 0xff;
  
  const r = Math.round(r1 + (r2 - r1) * ratio);
  const g = Math.round(g1 + (g2 - g1) * ratio);
  const b = Math.round(b1 + (b2 - b1) * ratio);
  
  return (r << 16) | (g << 8) | b;
};

export default GradientButton;
