import type { ResponsiveConfig } from '../hooks/useResponsive';
import { ResponsiveLayout } from './responsiveLayout';

// Debug utility to help visualize layout positioning
export const debugLayout = (config: ResponsiveConfig) => {
  const layout = new ResponsiveLayout(config);
  
  console.log('=== Layout Debug Info ===');
  console.log('Screen dimensions:', {
    width: config.screenWidth,
    height: config.screenHeight,
  });
  
  console.log('Board info:', {
    size: config.layout.boardSize,
    cellSize: config.layout.cellSize,
    position: layout.getBoardPosition(),
  });
  
  console.log('Center calculations:', {
    screenCenterX: config.screenWidth / 2,
    screenCenterY: config.screenHeight / 2,
    boardCenterX: layout.getBoardPosition().x + config.layout.boardSize / 2,
    boardCenterY: layout.getBoardPosition().y + config.layout.boardSize / 2,
  });
  
  console.log('Button position:', layout.getControlButtonsPosition());
  console.log('Dice position:', layout.getDicePosition());
  console.log('========================');
};
