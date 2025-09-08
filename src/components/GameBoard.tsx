import React from 'react';
import { useResponsive } from '../hooks/useResponsive';
import { ResponsiveLayout } from '../utils/responsiveLayout';
import { gameStyles } from '../config/gameStyles';
import { createTextStyle, createCellStyle, createBoardCenterStyle } from '../config/responsiveStyles';

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

  const centerStyle = createBoardCenterStyle(responsive.styles);
  const centerTextStyle = createTextStyle(responsive.styles, 'lg', gameStyles.colors.ui.text.primary, 'bold');

  const centerNode = (
    <>
      <pixiGraphics
        x={centerPos.x}
        y={centerPos.y}
        draw={(g) => {
          g.clear();
          g.fill(centerStyle.fill);
          g.rect(0, 0, centerDims.width, centerDims.height);
          g.fill();
          g.stroke({ color: centerStyle.stroke, width: centerStyle.strokeWidth });
          g.rect(0, 0, centerDims.width, centerDims.height);
          g.stroke();
        }}
      />
      <pixiText
        text={'monopoly'}
        x={centerPos.x + centerDims.width / 2}
        y={centerPos.y + centerDims.height / 2}
        anchor={{ x: 0.5, y: 0.5 }}
        style={centerTextStyle}
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
        
        const cellStyle = createCellStyle(responsive.styles, isBonus, isSelected);
        const cellTextStyle = createTextStyle(
          responsive.styles, 
          isSelected ? 'md' : 'sm', 
          isSelected ? gameStyles.colors.ui.text.primary : gameStyles.colors.ui.text.primary, 
          'bold'
        );
        
        return (
          <React.Fragment key={`cell-${index}`}>
            <pixiGraphics
              x={position.x}
              y={position.y}
              draw={(g) => {
                g.clear();
                g.fill(cellStyle.fill);
                g.rect(0, 0, cellStyle.width, cellStyle.height);
                g.fill();
                g.stroke({ color: cellStyle.stroke, width: cellStyle.strokeWidth });
                g.rect(0, 0, cellStyle.width, cellStyle.height);
                g.stroke();
              }}
            />
            <pixiText
              text={`${cell}`}
              x={position.x + cellStyle.width / 2}
              y={position.y + cellStyle.height / 2}
              anchor={{ x: 0.5, y: 0.5 }}
              style={cellTextStyle}
            />
          </React.Fragment>
        );
      })}
    </>
  );
};

export default GameBoard;
