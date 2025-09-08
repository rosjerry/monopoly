import React from 'react';
import { useResponsive } from '../hooks/useResponsive';
import { ResponsiveLayout } from '../utils/responsiveLayout';
import { createEnhancedCellStyle, createEnhancedBoardCenterStyle } from '../config/enhancedStyles';
import AnimatedText from './AnimatedText';

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
  const centerStyle = createEnhancedBoardCenterStyle();

  const centerNode = (
    <>
      <pixiGraphics
        x={centerPos.x}
        y={centerPos.y}
        draw={(g) => {
          g.clear();
          
          // Draw main center
          g.fill(centerStyle.fill);
          g.rect(0, 0, centerDims.width, centerDims.height);
          g.fill();
          
          // Draw border
          g.stroke({ color: centerStyle.stroke, width: centerStyle.strokeWidth });
          g.rect(0, 0, centerDims.width, centerDims.height);
          g.stroke();
        }}
      />
      <AnimatedText
        text="monopoly"
        x={centerPos.x + centerDims.width / 2}
        y={centerPos.y + centerDims.height / 2}
        size="xl"
        color="#ffffff"
        weight="bold"
        animated={true}
        animationType="colorChange"
        anchor={{ x: 0.5, y: 0.5 }}
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
        
        const cellStyle = createEnhancedCellStyle(isBonus, isSelected);
        
        return (
          <React.Fragment key={`cell-${index}`}>
            <pixiGraphics
              x={position.x}
              y={position.y}
              draw={(g) => {
                g.clear();
                
                // Draw main cell
                g.fill(cellStyle.fill);
                g.rect(0, 0, cellStyle.width, cellStyle.height);
                g.fill();
                
                // Draw border
                g.stroke({ color: cellStyle.stroke, width: cellStyle.strokeWidth });
                g.rect(0, 0, cellStyle.width, cellStyle.height);
                g.stroke();
              }}
            />
            <AnimatedText
              text={`${cell}`}
              x={position.x + cellStyle.width / 2}
              y={position.y + cellStyle.height / 2}
              size={isSelected ? "md" : "sm"}
              color={isSelected ? '#000000' : '#ffffff'}
              weight="bold"
              animated={isSelected}
              animationType={isSelected ? "pulse" : "none"}
              anchor={{ x: 0.5, y: 0.5 }}
            />
          </React.Fragment>
        );
      })}
    </>
  );
};

export default GameBoard;