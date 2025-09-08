import React from 'react';

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
  return (
    <>
      <pixiGraphics
        x={window.innerWidth - 80}
        y={window.innerHeight - 80}
        draw={(g) => {
          g.clear();
          g.fill(0x2c3e50, 0.9);
          g.circle(0, 0, 28);
          g.fill();
          g.stroke({ color: 0xecf0f1, width: 2 });
          g.circle(0, 0, 28);
          g.stroke();
        }}
        eventMode='static'
        onPointerDown={() => onOpenModePopup(!isMockMode)}
        cursor='pointer'
      />
      <pixiText
        text={isMockMode ? 'Mock' : 'Live'}
        x={window.innerWidth - 80}
        y={window.innerHeight - 80}
        anchor={{ x: 0.5, y: 0.5 }}
        style={{ fontSize: 12, fill: '#ecf0f1', fontFamily: 'Arial', fontWeight: 'bold' }}
      />

      {showModePopup && (
        <>
          <pixiGraphics
            x={0}
            y={0}
            draw={(g) => {
              g.clear();
              g.fill(0x000000, 0.5);
              g.rect(0, 0, window.innerWidth, window.innerHeight);
              g.fill();
            }}
            eventMode='static'
            onPointerDown={onCancelModeSwitch}
          />
          <pixiGraphics
            x={window.innerWidth / 2 - 180}
            y={window.innerHeight / 2 - 100}
            draw={(g) => {
              g.clear();
              g.fill(0x34495e, 0.95);
              g.roundRect(0, 0, 360, 180, 12);
              g.fill();
              g.stroke({ color: 0xffffff, width: 2 });
              g.roundRect(0, 0, 360, 180, 12);
              g.stroke();
            }}
          />
          <pixiText
            text={pendingTargetMock ? 'Switch to Mock mode?' : 'Switch to Live mode?'}
            x={window.innerWidth / 2}
            y={window.innerHeight / 2 - 60}
            anchor={{ x: 0.5, y: 0.5 }}
            style={{ fontSize: 18, fill: '#ffffff', fontFamily: 'Arial', fontWeight: 'bold' }}
          />
          {!pendingTargetMock && (
            <pixiText
              text={'Warning: switching from Mock will lose local game state.'}
              x={window.innerWidth / 2}
              y={window.innerHeight / 2 - 25}
              anchor={{ x: 0.5, y: 0.5 }}
              style={{ fontSize: 14, fill: '#ffcc00', fontFamily: 'Arial' }}
            />
          )}
          <pixiGraphics
            x={window.innerWidth / 2 - 120}
            y={window.innerHeight / 2 + 20}
            draw={(g) => {
              g.clear();
              g.fill(0x27ae60);
              g.roundRect(0, 0, 120, 40, 8);
              g.fill();
            }}
            eventMode='static'
            onPointerDown={onApplyModeSwitch}
            cursor='pointer'
          />
          <pixiText
            text={pendingTargetMock ? 'Switch to Mock' : 'Switch to Live'}
            x={window.innerWidth / 2 - 60}
            y={window.innerHeight / 2 + 40}
            anchor={{ x: 0.5, y: 0.5 }}
            style={{ fontSize: 16, fill: '#ffffff', fontFamily: 'Arial', fontWeight: 'bold' }}
          />
          <pixiGraphics
            x={window.innerWidth / 2 + 0}
            y={window.innerHeight / 2 + 20}
            draw={(g) => {
              g.clear();
              g.fill(0xc0392b);
              g.roundRect(0, 0, 120, 40, 8);
              g.fill();
            }}
            eventMode='static'
            onPointerDown={onCancelModeSwitch}
            cursor='pointer'
          />
          <pixiText
            text={'Cancel'}
            x={window.innerWidth / 2 + 60}
            y={window.innerHeight / 2 + 40}
            anchor={{ x: 0.5, y: 0.5 }}
            style={{ fontSize: 16, fill: '#ffffff', fontFamily: 'Arial', fontWeight: 'bold' }}
          />
        </>
      )}
    </>
  );
};

export default ModeSwitcher;
