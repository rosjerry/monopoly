import React from 'react';
import { useResponsive } from '../hooks/useResponsive';
import { ResponsiveLayout } from '../utils/responsiveLayout';
import { gameStyles } from '../config/gameStyles';
import { createTextStyle, createModeSwitcherStyle, createPopupStyle, createButtonStyle } from '../config/responsiveStyles';

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
  
  const modeSwitcherStyle = createModeSwitcherStyle(responsive.styles);
  const modeTextStyle = createTextStyle(responsive.styles, 'sm', gameStyles.colors.ui.text.secondary, 'bold');
  const popupStyle = createPopupStyle(responsive.styles);
  const successButtonStyle = createButtonStyle(responsive.styles, 'success');
  const dangerButtonStyle = createButtonStyle(responsive.styles, 'danger');
  const popupTextStyle = createTextStyle(responsive.styles, 'md', gameStyles.colors.ui.text.primary, 'bold');
  const warningTextStyle = createTextStyle(responsive.styles, 'sm', gameStyles.colors.ui.text.warning);
  const buttonTextStyle = createTextStyle(responsive.styles, 'sm', gameStyles.colors.ui.text.primary, 'bold');
  
  return (
    <>
      <pixiGraphics
        x={position.x}
        y={position.y}
        draw={(g) => {
          g.clear();
          g.fill(modeSwitcherStyle.fill, 0.9);
          g.circle(0, 0, modeSwitcherStyle.size);
          g.fill();
          g.stroke({ color: modeSwitcherStyle.stroke, width: modeSwitcherStyle.strokeWidth });
          g.circle(0, 0, modeSwitcherStyle.size);
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
        style={modeTextStyle}
      />

      {showModePopup && (
        <>
          <pixiGraphics
            x={0}
            y={0}
            draw={(g) => {
              g.clear();
              g.fill(popupStyle.overlay, 0.5);
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
              g.fill(popupStyle.background, 0.95);
              g.roundRect(0, 0, responsive.isMobile ? 280 : 360, responsive.isMobile ? 160 : 180, popupStyle.borderRadius);
              g.fill();
              g.stroke({ color: popupStyle.stroke, width: popupStyle.strokeWidth });
              g.roundRect(0, 0, responsive.isMobile ? 280 : 360, responsive.isMobile ? 160 : 180, popupStyle.borderRadius);
              g.stroke();
            }}
          />
          <pixiText
            text={pendingTargetMock ? 'Switch to Mock mode?' : 'Switch to Live mode?'}
            x={responsive.screenWidth / 2}
            y={responsive.screenHeight / 2 - (responsive.isMobile ? 40 : 60)}
            anchor={{ x: 0.5, y: 0.5 }}
            style={popupTextStyle}
          />
          {!pendingTargetMock && (
            <pixiText
              text={'Warning: switching from Mock will lose local game state.'}
              x={responsive.screenWidth / 2}
              y={responsive.screenHeight / 2 - (responsive.isMobile ? 15 : 25)}
              anchor={{ x: 0.5, y: 0.5 }}
              style={warningTextStyle}
            />
          )}
          <pixiGraphics
            x={responsive.screenWidth / 2 - (responsive.isMobile ? 100 : 120)}
            y={responsive.screenHeight / 2 + (responsive.isMobile ? 10 : 20)}
            draw={(g) => {
              g.clear();
              g.fill(successButtonStyle.fill);
              g.roundRect(0, 0, responsive.isMobile ? 80 : 120, responsive.isMobile ? 32 : 40, successButtonStyle.borderRadius);
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
            style={buttonTextStyle}
          />
          <pixiGraphics
            x={responsive.screenWidth / 2 + (responsive.isMobile ? 20 : 0)}
            y={responsive.screenHeight / 2 + (responsive.isMobile ? 10 : 20)}
            draw={(g) => {
              g.clear();
              g.fill(dangerButtonStyle.fill);
              g.roundRect(0, 0, responsive.isMobile ? 80 : 120, responsive.isMobile ? 32 : 40, dangerButtonStyle.borderRadius);
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
            style={buttonTextStyle}
          />
        </>
      )}
    </>
  );
};

export default ModeSwitcher;
