import React from 'react';
import { useResponsive } from '../hooks/useResponsive';
import { ResponsiveLayout } from '../utils/responsiveLayout';

const DebugOverlay: React.FC = () => {
  const responsive = useResponsive();
  const layout = new ResponsiveLayout(responsive);
  
  const boardPos = layout.getBoardPosition();
  const centerX = responsive.screenWidth / 2;
  const centerY = responsive.screenHeight / 2;
  
  return (
    <>
      {/* Screen center crosshair */}
      <pixiGraphics
        x={centerX - 10}
        y={centerY}
        draw={(g) => {
          g.clear();
          g.stroke({ color: 0xff0000, width: 2 });
          g.moveTo(0, 0);
          g.lineTo(20, 0);
        }}
      />
      <pixiGraphics
        x={centerX}
        y={centerY - 10}
        draw={(g) => {
          g.clear();
          g.stroke({ color: 0xff0000, width: 2 });
          g.moveTo(0, 0);
          g.lineTo(0, 20);
        }}
      />
      
      {/* Board center crosshair */}
      <pixiGraphics
        x={boardPos.x + responsive.layout.boardSize / 2 - 10}
        y={boardPos.y + responsive.layout.boardSize / 2}
        draw={(g) => {
          g.clear();
          g.stroke({ color: 0x00ff00, width: 2 });
          g.moveTo(0, 0);
          g.lineTo(20, 0);
        }}
      />
      <pixiGraphics
        x={boardPos.x + responsive.layout.boardSize / 2}
        y={boardPos.y + responsive.layout.boardSize / 2 - 10}
        draw={(g) => {
          g.clear();
          g.stroke({ color: 0x00ff00, width: 2 });
          g.moveTo(0, 0);
          g.lineTo(0, 20);
        }}
      />
      
      {/* Board outline */}
      <pixiGraphics
        x={boardPos.x}
        y={boardPos.y}
        draw={(g) => {
          g.clear();
          g.stroke({ color: 0x0000ff, width: 2 });
          g.rect(0, 0, responsive.layout.boardSize, responsive.layout.boardSize);
          g.stroke();
        }}
      />
      
      {/* Debug text */}
      <pixiText
        text={`Screen: ${responsive.screenWidth}x${responsive.screenHeight}`}
        x={10}
        y={responsive.screenHeight - 60}
        style={{
          fontSize: 12,
          fill: '#ffffff',
          fontFamily: 'Arial',
        }}
      />
      <pixiText
        text={`Board: ${responsive.layout.boardSize}x${responsive.layout.boardSize}`}
        x={10}
        y={responsive.screenHeight - 40}
        style={{
          fontSize: 12,
          fill: '#ffffff',
          fontFamily: 'Arial',
        }}
      />
      <pixiText
        text={`Board Pos: ${Math.round(boardPos.x)}, ${Math.round(boardPos.y)}`}
        x={10}
        y={responsive.screenHeight - 20}
        style={{
          fontSize: 12,
          fill: '#ffffff',
          fontFamily: 'Arial',
        }}
      />
    </>
  );
};

export default DebugOverlay;
