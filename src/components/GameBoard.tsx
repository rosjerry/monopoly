import React from 'react';
import { useResponsive } from '../hooks/useResponsive';
import { ResponsiveLayout } from '../utils/responsiveLayout';

interface GameBoardProps {
  board: (string | number)[] | null;
  currentIndex: number;
}

const GameBoard: React.FC<GameBoardProps> = ({ board, currentIndex }) => {
  const responsive = useResponsive();
  const layout = new ResponsiveLayout(responsive);

  if (!board) {
    return null;
  }

  const cellPositions = layout.getBoardCellPositions();
  const centerPos = layout.getCenterBoardPosition();
  const centerDims = layout.getCenterBoardDimensions();

  const centerNode = (
    <>
      <pixiGraphics
        x={centerPos.x}
        y={centerPos.y}
        draw={(g) => {
          g.clear();
          g.fill(0x1abc9c);
          g.rect(0, 0, centerDims.width, centerDims.height);
          g.fill();
          g.stroke({ color: 0x16a085, width: responsive.isMobile ? 2 : 4 });
          g.rect(0, 0, centerDims.width, centerDims.height);
          g.stroke();
        }}
      />
      <pixiText
        text={'monopoly'}
        x={centerPos.x + centerDims.width / 2}
        y={centerPos.y + centerDims.height / 2}
        anchor={{ x: 0.5, y: 0.5 }}
        style={{
          fontSize: responsive.fontSize.large,
          fill: '#ffffff',
          fontFamily: 'Arial',
          fontWeight: 'bold',
        }}
      />
    </>
  );

  return (
    <>
      {centerNode}
      {board.map((cell, index) => {
        const position = cellPositions[index];
        const isBonus = cell === 'bonus';
        const isSelected = index === currentIndex;
        
        return (
          <React.Fragment key={`cell-${index}`}>
            <pixiGraphics
              x={position.x}
              y={position.y}
              draw={(g) => {
                g.clear();
                const baseFill = isBonus ? 0xf39c12 : 0x8e44ad;
                const highlightFill = isBonus ? 0xffc04d : 0xa569bd;
                g.fill(isSelected ? highlightFill : baseFill);
                g.rect(0, 0, responsive.layout.cellSize, responsive.layout.cellSize);
                g.fill();
                g.stroke({ 
                  color: isSelected ? 0xffff00 : 0x34495e, 
                  width: isSelected ? (responsive.isMobile ? 3 : 4) : (responsive.isMobile ? 1 : 2) 
                });
                g.rect(0, 0, responsive.layout.cellSize, responsive.layout.cellSize);
                g.stroke();
              }}
            />
            <pixiText
              text={`${cell}`}
              x={position.x + responsive.layout.cellSize / 2}
              y={position.y + responsive.layout.cellSize / 2}
              anchor={{ x: 0.5, y: 0.5 }}
              style={{
                fontSize: isSelected ? responsive.fontSize.medium : responsive.fontSize.small,
                fill: isSelected ? '#000000' : '#ffffff',
                fontFamily: 'Arial',
                fontWeight: 'bold',
              }}
            />
          </React.Fragment>
        );
      })}
    </>
  );
};

export default GameBoard;
