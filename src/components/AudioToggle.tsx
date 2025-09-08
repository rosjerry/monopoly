import React from 'react';
import { useResponsive } from '../hooks/useResponsive';
import { ResponsiveLayout } from '../utils/responsiveLayout';
import { gameStyles } from '../config/gameStyles';
import { createTextStyle, createModeSwitcherStyle } from '../config/responsiveStyles';
import { useAudioStore } from '../store/audioStore';

const AudioToggle: React.FC = () => {
  const { isAudioEnabled, toggleAudio } = useAudioStore();
  const responsive = useResponsive();
  const layout = new ResponsiveLayout(responsive);
  
  // Position audio toggle just below the mode switcher
  const modeSwitcherPos = layout.getModeSwitcherPosition();
  const buttonSize = responsive.isMobile ? 24 : 28;
  const position = {
    x: modeSwitcherPos.x,
    y: modeSwitcherPos.y + buttonSize + responsive.spacing.md,
  };
  
  const modeSwitcherStyle = createModeSwitcherStyle(responsive.styles);
  const textStyle = createTextStyle(
    responsive.styles, 
    'xs', 
    isAudioEnabled ? gameStyles.colors.ui.text.secondary : gameStyles.colors.ui.text.warning, 
    'bold'
  );
  
  return (
    <>
      <pixiGraphics
        x={position.x}
        y={position.y}
        draw={(g) => {
          g.clear();
          g.fill(
            isAudioEnabled 
              ? modeSwitcherStyle.fill 
              : gameStyles.colors.ui.buttons.primary.disabled.fill, 
            0.9
          );
          g.circle(0, 0, modeSwitcherStyle.size);
          g.fill();
          g.stroke({ 
            color: isAudioEnabled 
              ? modeSwitcherStyle.stroke 
              : gameStyles.colors.ui.buttons.primary.disabled.stroke, 
            width: modeSwitcherStyle.strokeWidth 
          });
          g.circle(0, 0, modeSwitcherStyle.size);
          g.stroke();
        }}
        eventMode='static'
        onPointerDown={toggleAudio}
        cursor='pointer'
      />
      <pixiText
        text={isAudioEnabled ? '🔊' : '🔇'}
        x={position.x}
        y={position.y}
        anchor={{ x: 0.5, y: 0.5 }}
        style={{
          ...textStyle,
          fontSize: responsive.isMobile ? 16 : 18,
        }}
      />
    </>
  );
};

export default AudioToggle;
