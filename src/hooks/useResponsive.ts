import { useState, useEffect } from 'react';
import { getResponsiveStyles, type ResponsiveStyles } from '../config/responsiveStyles';

export interface ResponsiveConfig {
  screenWidth: number;
  screenHeight: number;
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  scale: number;
  boardScale: number;
  styles: ResponsiveStyles;
  // Legacy properties for backward compatibility
  fontSize: {
    small: number;
    medium: number;
    large: number;
    xlarge: number;
  };
  spacing: {
    xs: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
  };
  layout: {
    boardSize: number;
    cellSize: number;
    buttonWidth: number;
    buttonHeight: number;
  };
}

const BREAKPOINTS = {
  mobile: 768,
  tablet: 1024,
} as const;

const BASE_DIMENSIONS = {
  width: 1200,
  height: 800,
} as const;

export const useResponsive = (): ResponsiveConfig => {
  const [dimensions, setDimensions] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    const handleResize = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const { width, height } = dimensions;
  const isMobile = width < BREAKPOINTS.mobile;
  const isTablet = width >= BREAKPOINTS.mobile && width < BREAKPOINTS.tablet;
  const isDesktop = width >= BREAKPOINTS.tablet;

  // Calculate scale factors
  const scale = Math.min(width / BASE_DIMENSIONS.width, height / BASE_DIMENSIONS.height);
  const boardScale = isMobile ? scale * 0.8 : scale;

  // Responsive font sizes
  const fontSize = {
    small: isMobile ? 12 : isTablet ? 14 : 16,
    medium: isMobile ? 16 : isTablet ? 18 : 20,
    large: isMobile ? 20 : isTablet ? 24 : 28,
    xlarge: isMobile ? 24 : isTablet ? 28 : 32,
  };

  // Responsive spacing
  const spacing = {
    xs: isMobile ? 4 : isTablet ? 6 : 8,
    sm: isMobile ? 8 : isTablet ? 12 : 16,
    md: isMobile ? 12 : isTablet ? 16 : 20,
    lg: isMobile ? 16 : isTablet ? 24 : 32,
    xl: isMobile ? 24 : isTablet ? 32 : 40,
  };

  // Responsive layout dimensions
  const cellSize = isMobile ? 40 : isTablet ? 50 : 60;
  const boardSpacing = isMobile ? 12 : isTablet ? 16 : 20; // Use md spacing for board
  const total = cellSize + boardSpacing;
  
  // Calculate board size based on 5x5 grid (16 cells total around the perimeter)
  const boardSize = total * 5 - boardSpacing; // 5 cells + 4 spacings
  
  const layout = {
    boardSize: boardSize,
    cellSize: cellSize,
    buttonWidth: isMobile ? 80 : isTablet ? 100 : 120,
    buttonHeight: isMobile ? 32 : isTablet ? 36 : 40,
  };

  // Create responsive styles configuration
  const styles = getResponsiveStyles({
    screenWidth: width,
    screenHeight: height,
    isMobile,
    isTablet,
    isDesktop,
    scale,
    boardScale,
  });

  return {
    screenWidth: width,
    screenHeight: height,
    isMobile,
    isTablet,
    isDesktop,
    scale,
    boardScale,
    styles,
    // Legacy properties for backward compatibility
    fontSize,
    spacing,
    layout,
  };
};
