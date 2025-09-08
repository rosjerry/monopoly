import type { ResponsiveConfig } from '../hooks/useResponsive';

export interface LayoutPosition {
  x: number;
  y: number;
}

export interface LayoutDimensions {
  width: number;
  height: number;
}

export class ResponsiveLayout {
  private config: ResponsiveConfig;

  constructor(config: ResponsiveConfig) {
    this.config = config;
  }

  // Board positioning
  getBoardPosition(): LayoutPosition {
    const { screenWidth, screenHeight, layout } = this.config;
    
    // Perfect centering like CSS flexbox: justify-content: center, align-items: center
    const centerX = screenWidth / 2;
    const centerY = screenHeight / 2;
    
    return {
      x: centerX - layout.boardSize / 2,
      y: centerY - layout.boardSize / 2,
    };
  }

  // UI element positioning
  getBalancePosition(): LayoutPosition {
    const { spacing } = this.config;
    
    // Position balance in top left corner
    return {
      x: spacing.md,
      y: spacing.md,
    };
  }

  getControlButtonsPosition(): LayoutPosition {
    const { screenWidth, layout, spacing } = this.config;
    
    // Position buttons above the board, center justified
    const boardPos = this.getBoardPosition();
    const buttonsTotalWidth = layout.buttonWidth * 2 + spacing.md;
    
    return {
      x: (screenWidth - buttonsTotalWidth) / 2,
      y: boardPos.y - layout.buttonHeight - spacing.lg,
    };
  }

  getDicePosition(): LayoutPosition {
    const { screenWidth, layout, spacing } = this.config;
    
    // Position dice below the board, perfectly centered
    const boardPos = this.getBoardPosition();
    const diceSize = this.config.isMobile ? 40 : this.config.isTablet ? 48 : 56;
    const diceGap = spacing.md;
    const diceTotalWidth = diceSize * 2 + diceGap;
    
    // Calculate the center point of the screen
    const screenCenterX = screenWidth / 2;
    
    // Position the first die so that the center of both dice aligns with screen center
    const firstDieX = screenCenterX - (diceTotalWidth / 2) + (diceSize / 2);
    
    return {
      x: firstDieX,
      y: boardPos.y + layout.boardSize + spacing.xl,
    };
  }

  getGameInfoPosition(): LayoutPosition {
    const { spacing } = this.config;
    
    // Position game info in top left corner, below balance
    return {
      x: spacing.md,
      y: spacing.xl + 30, // Below balance display
    };
  }

  getModeSwitcherPosition(): LayoutPosition {
    const { screenWidth, spacing } = this.config;
    
    // Position mode switcher in top right corner
    const buttonSize = this.config.isMobile ? 24 : 28;
    return {
      x: screenWidth - buttonSize - spacing.md,
      y: spacing.md,
    };
  }

  // Calculate board cell positions
  getBoardCellPositions(): LayoutPosition[] {
    const boardPos = this.getBoardPosition();
    const { layout, spacing } = this.config;
    
    const cellSize = layout.cellSize;
    const total = cellSize + spacing.md; // Use consistent spacing
    const startX = boardPos.x;
    const startY = boardPos.y;

    const positions: LayoutPosition[] = [];
    
    // Top row (left to right)
    for (let c = 0; c < 5; c++) {
      positions.push({ x: startX + c * total, y: startY });
    }
    
    // Right column (top to bottom)
    for (let r = 1; r < 4; r++) {
      positions.push({ x: startX + 4 * total, y: startY + r * total });
    }
    
    // Bottom row (right to left)
    for (let c = 4; c >= 0; c--) {
      positions.push({ x: startX + c * total, y: startY + 4 * total });
    }
    
    // Left column (bottom to top)
    for (let r = 3; r >= 1; r--) {
      positions.push({ x: startX, y: startY + r * total });
    }

    return positions;
  }

  getCenterBoardPosition(): LayoutPosition {
    const boardPos = this.getBoardPosition();
    const { layout, spacing } = this.config;
    
    const cellSize = layout.cellSize;
    const total = cellSize + spacing.md; // Use consistent spacing
    
    return {
      x: boardPos.x + total,
      y: boardPos.y + total,
    };
  }

  getCenterBoardDimensions(): LayoutDimensions {
    const { layout, spacing } = this.config;
    
    const cellSize = layout.cellSize;
    const total = cellSize + spacing.md; // Use consistent spacing
    
    return {
      width: total * 3 - spacing.md,
      height: total * 3 - spacing.md,
    };
  }
}
