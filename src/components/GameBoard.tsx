import React from 'react';

interface GameBoardProps {
  board: (string | number)[] | null;
  currentIndex: number;
}

const GameBoard: React.FC<GameBoardProps> = ({ board, currentIndex }) => {
  if (!board) {
    return null;
  }

  const cellSize = 60;
  const spacing = 20;
  const total = cellSize + spacing;
  const startX = 350;
  const startY = 300;

  const positions: { row: number; col: number }[] = [];
  for (let c = 0; c < 5; c += 1) positions.push({ row: 0, col: c });
  for (let r = 1; r < 4; r += 1) positions.push({ row: r, col: 4 });
  for (let c = 4; c >= 0; c -= 1) positions.push({ row: 4, col: c });
  for (let r = 3; r >= 1; r -= 1) positions.push({ row: r, col: 0 });

  const centerTopLeftX = startX + total * 1;
  const centerTopLeftY = startY + total * 1;
  const centerWidth = total * 3 - spacing;
  const centerHeight = total * 3 - spacing;

  const centerNode = (
    <>
      <pixiGraphics
        x={centerTopLeftX}
        y={centerTopLeftY}
        draw={(g) => {
          g.clear();
          g.fill(0x1abc9c);
          g.rect(0, 0, centerWidth, centerHeight);
          g.fill();
          g.stroke({ color: 0x16a085, width: 4 });
          g.rect(0, 0, centerWidth, centerHeight);
          g.stroke();
        }}
      />
      <pixiText
        text={'monopoly'}
        x={centerTopLeftX + centerWidth / 2}
        y={centerTopLeftY + centerHeight / 2}
        anchor={{ x: 0.5, y: 0.5 }}
        style={{
          fontSize: 28,
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
        const { row, col } = positions[index];
        const x = startX + col * total;
        const y = startY + row * total;
        const isBonus = cell === 'bonus';
        const isSelected = index === currentIndex;
        
        return (
          <React.Fragment key={`cell-${index}`}>
            <pixiGraphics
              x={x}
              y={y}
              draw={(g) => {
                g.clear();
                const baseFill = isBonus ? 0xf39c12 : 0x8e44ad;
                const highlightFill = isBonus ? 0xffc04d : 0xa569bd;
                g.fill(isSelected ? highlightFill : baseFill);
                g.rect(0, 0, cellSize, cellSize);
                g.fill();
                g.stroke({ color: isSelected ? 0xffff00 : 0x34495e, width: isSelected ? 4 : 2 });
                g.rect(0, 0, cellSize, cellSize);
                g.stroke();
              }}
            />
            <pixiText
              text={`${cell}`}
              x={x + cellSize / 2}
              y={y + cellSize / 2}
              anchor={{ x: 0.5, y: 0.5 }}
              style={{
                fontSize: isSelected ? 18 : 16,
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
