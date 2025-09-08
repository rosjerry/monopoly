import React from 'react';
import { useResponsive } from '../hooks/useResponsive';
import { ResponsiveLayout } from '../utils/responsiveLayout';

interface ModeSwitcherProps {
  isMockMode: boolean;
  showModePopup: boolean;
  pendingTargetMock: boolean | null;
  onOpenModePopup: (targetMock: boolean) => void;
  onApplyModeSwitch: () => void;
  onCancelModeSwitch: () => void;
}

const ModeSwitcher: React.FC<ModeSwitcherProps> = ({
  isMockMode,
  showModePopup,
  pendingTargetMock,
  onOpenModePopup,
  onApplyModeSwitch,
  onCancelModeSwitch,
}) => {
  const responsive = useResponsive();
  const layout = new ResponsiveLayout(responsive);
  const position = layout.getModeSwitcherPosition();
  
  const buttonSize = responsive.isMobile ? 24 : 28;
  
  return (
    <>
      <pixiGraphics
        x={position.x}
        y={position.y}
        draw={(g) => {
          g.clear();
          g.fill(0x2c3e50, 0.9);
          g.circle(0, 0, buttonSize);
          g.fill();
          g.stroke({ color: 0xecf0f1, width: responsive.isMobile ? 1 : 2 });
          g.circle(0, 0, buttonSize);
          g.stroke();
        }}
        eventMode='static'
        onPointerDown={() => onOpenModePopup(!isMockMode)}
        cursor='pointer'
      />
      <pixiText
        text={isMockMode ? 'Mock' : 'Live'}
        x={position.x}
        y={position.y}
        anchor={{ x: 0.5, y: 0.5 }}
        style={{ 
          fontSize: responsive.fontSize.small, 
          fill: '#ecf0f1', 
          fontFamily: 'Arial', 
          fontWeight: 'bold' 
        }}
      />

      {showModePopup && (
        <>
          <pixiGraphics
            x={0}
            y={0}
            draw={(g) => {
              g.clear();
              g.fill(0x000000, 0.5);
              g.rect(0, 0, responsive.screenWidth, responsive.screenHeight);
              g.fill();
            }}
            eventMode='static'
            onPointerDown={onCancelModeSwitch}
          />
          <pixiGraphics
            x={responsive.screenWidth / 2 - (responsive.isMobile ? 140 : 180)}
            y={responsive.screenHeight / 2 - (responsive.isMobile ? 80 : 100)}
            draw={(g) => {
              g.clear();
              g.fill(0x34495e, 0.95);
              g.roundRect(0, 0, responsive.isMobile ? 280 : 360, responsive.isMobile ? 160 : 180, 12);
              g.fill();
              g.stroke({ color: 0xffffff, width: responsive.isMobile ? 1 : 2 });
              g.roundRect(0, 0, responsive.isMobile ? 280 : 360, responsive.isMobile ? 160 : 180, 12);
              g.stroke();
            }}
          />
          <pixiText
            text={pendingTargetMock ? 'Switch to Mock mode?' : 'Switch to Live mode?'}
            x={responsive.screenWidth / 2}
            y={responsive.screenHeight / 2 - (responsive.isMobile ? 40 : 60)}
            anchor={{ x: 0.5, y: 0.5 }}
            style={{ 
              fontSize: responsive.fontSize.medium, 
              fill: '#ffffff', 
              fontFamily: 'Arial', 
              fontWeight: 'bold' 
            }}
          />
          {!pendingTargetMock && (
            <pixiText
              text={'Warning: switching from Mock will lose local game state.'}
              x={responsive.screenWidth / 2}
              y={responsive.screenHeight / 2 - (responsive.isMobile ? 15 : 25)}
              anchor={{ x: 0.5, y: 0.5 }}
              style={{ 
                fontSize: responsive.fontSize.small, 
                fill: '#ffcc00', 
                fontFamily: 'Arial' 
              }}
            />
          )}
          <pixiGraphics
            x={responsive.screenWidth / 2 - (responsive.isMobile ? 100 : 120)}
            y={responsive.screenHeight / 2 + (responsive.isMobile ? 10 : 20)}
            draw={(g) => {
              g.clear();
              g.fill(0x27ae60);
              g.roundRect(0, 0, responsive.isMobile ? 80 : 120, responsive.isMobile ? 32 : 40, 8);
              g.fill();
            }}
            eventMode='static'
            onPointerDown={onApplyModeSwitch}
            cursor='pointer'
          />
          <pixiText
            text={pendingTargetMock ? 'Switch to Mock' : 'Switch to Live'}
            x={responsive.screenWidth / 2 - (responsive.isMobile ? 60 : 60)}
            y={responsive.screenHeight / 2 + (responsive.isMobile ? 26 : 40)}
            anchor={{ x: 0.5, y: 0.5 }}
            style={{ 
              fontSize: responsive.fontSize.small, 
              fill: '#ffffff', 
              fontFamily: 'Arial', 
              fontWeight: 'bold' 
            }}
          />
          <pixiGraphics
            x={responsive.screenWidth / 2 + (responsive.isMobile ? 20 : 0)}
            y={responsive.screenHeight / 2 + (responsive.isMobile ? 10 : 20)}
            draw={(g) => {
              g.clear();
              g.fill(0xc0392b);
              g.roundRect(0, 0, responsive.isMobile ? 80 : 120, responsive.isMobile ? 32 : 40, 8);
              g.fill();
            }}
            eventMode='static'
            onPointerDown={onCancelModeSwitch}
            cursor='pointer'
          />
          <pixiText
            text={'Cancel'}
            x={responsive.screenWidth / 2 + (responsive.isMobile ? 60 : 60)}
            y={responsive.screenHeight / 2 + (responsive.isMobile ? 26 : 40)}
            anchor={{ x: 0.5, y: 0.5 }}
            style={{ 
              fontSize: responsive.fontSize.small, 
              fill: '#ffffff', 
              fontFamily: 'Arial', 
              fontWeight: 'bold' 
            }}
          />
        </>
      )}
    </>
  );
};

export default ModeSwitcher;
