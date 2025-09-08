import { gameStyles, getFontSize, getSpacing, getStrokeWidth } from './gameStyles';
// import type { ResponsiveConfig } from '../hooks/useResponsive';

// Responsive style configuration that adapts to screen size
export interface ResponsiveStyles {
  // Typography that scales with screen size
  typography: {
    fontSize: {
      xs: number;
      sm: number;
      md: number;
      lg: number;
      xl: number;
      xxl: number;
    };
    fontFamily: string;
    fontWeight: {
      normal: 'normal';
      bold: 'bold';
    };
  };
  
  // Spacing that adapts to screen size
  spacing: {
    xs: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
    xxl: number;
  };
  
  // Stroke widths that adapt to screen size
  strokeWidths: {
    thin: number;
    normal: number;
    thick: number;
  };
  
  // Border radius that adapts to screen size
  borderRadius: {
    sm: number;
    md: number;
    lg: number;
  };
  
  // Layout dimensions that adapt to screen size
  layout: {
    cellSize: number;
    buttonWidth: number;
    buttonHeight: number;
    diceSize: number;
    modeSwitcherSize: number;
  };
}

// Generate responsive styles based on screen configuration
export const getResponsiveStyles = (config: {
  screenWidth: number;
  screenHeight: number;
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  scale: number;
  boardScale: number;
}): ResponsiveStyles => {
  const { isMobile, isTablet } = config;
  
  // Scale factors for different screen sizes
  const fontSizeScale = isMobile ? 0.8 : isTablet ? 0.9 : 1.0;
  const spacingScale = isMobile ? 0.7 : isTablet ? 0.85 : 1.0;
  const strokeScale = isMobile ? 0.5 : isTablet ? 0.75 : 1.0;
  const borderRadiusScale = isMobile ? 0.8 : isTablet ? 0.9 : 1.0;
  
  return {
    typography: {
      fontSize: {
        xs: Math.round(getFontSize('xs') * fontSizeScale),
        sm: Math.round(getFontSize('sm') * fontSizeScale),
        md: Math.round(getFontSize('md') * fontSizeScale),
        lg: Math.round(getFontSize('lg') * fontSizeScale),
        xl: Math.round(getFontSize('xl') * fontSizeScale),
        xxl: Math.round(getFontSize('xxl') * fontSizeScale),
      },
      fontFamily: gameStyles.typography.fontFamily,
      fontWeight: {
        normal: 'normal' as const,
        bold: 'bold' as const,
      },
    },
    
    spacing: {
      xs: Math.round(getSpacing('xs') * spacingScale),
      sm: Math.round(getSpacing('sm') * spacingScale),
      md: Math.round(getSpacing('md') * spacingScale),
      lg: Math.round(getSpacing('lg') * spacingScale),
      xl: Math.round(getSpacing('xl') * spacingScale),
      xxl: Math.round(getSpacing('xxl') * spacingScale),
    },
    
    strokeWidths: {
      thin: Math.max(1, Math.round(getStrokeWidth('thin') * strokeScale)),
      normal: Math.max(1, Math.round(getStrokeWidth('normal') * strokeScale)),
      thick: Math.max(2, Math.round(getStrokeWidth('thick') * strokeScale)),
    },
    
    borderRadius: {
      sm: Math.round(gameStyles.borderRadius.sm * borderRadiusScale),
      md: Math.round(gameStyles.borderRadius.md * borderRadiusScale),
      lg: Math.round(gameStyles.borderRadius.lg * borderRadiusScale),
    },
    
    layout: {
      cellSize: isMobile ? 40 : isTablet ? 50 : 60,
      buttonWidth: isMobile ? 80 : isTablet ? 100 : 120,
      buttonHeight: isMobile ? 32 : isTablet ? 36 : 40,
      diceSize: isMobile ? 40 : isTablet ? 48 : 56,
      modeSwitcherSize: isMobile ? 24 : 28,
    },
  };
};

// Style helper functions for components
export const createTextStyle = (
  responsiveStyles: ResponsiveStyles,
  size: keyof ResponsiveStyles['typography']['fontSize'],
  color: string,
  weight: keyof ResponsiveStyles['typography']['fontWeight'] = 'normal'
) => ({
  fontSize: responsiveStyles.typography.fontSize[size],
  fill: color,
  fontFamily: responsiveStyles.typography.fontFamily,
  fontWeight: responsiveStyles.typography.fontWeight[weight],
});

export const createButtonStyle = (
  responsiveStyles: ResponsiveStyles,
  type: 'primary' | 'secondary' | 'danger' | 'success' = 'primary'
) => {
  const colors = gameStyles.colors.ui.buttons[type];
  return {
    fill: colors.fill,
    stroke: colors.stroke,
    width: responsiveStyles.layout.buttonWidth,
    height: responsiveStyles.layout.buttonHeight,
    strokeWidth: responsiveStyles.strokeWidths.normal,
    borderRadius: responsiveStyles.borderRadius.md,
  };
};

export const createDisabledButtonStyle = (
  responsiveStyles: ResponsiveStyles
) => {
  const colors = gameStyles.colors.ui.buttons.primary.disabled;
  return {
    fill: colors.fill,
    stroke: colors.stroke,
    width: responsiveStyles.layout.buttonWidth,
    height: responsiveStyles.layout.buttonHeight,
    strokeWidth: responsiveStyles.strokeWidths.normal,
    borderRadius: responsiveStyles.borderRadius.md,
  };
};

export const createCellStyle = (
  responsiveStyles: ResponsiveStyles,
  isBonus: boolean,
  isSelected: boolean
) => {
  const colors = isBonus 
    ? gameStyles.colors.board.cells.bonus 
    : gameStyles.colors.board.cells.regular;
  
  const strokeColor = isSelected 
    ? gameStyles.colors.board.cells.selected.stroke 
    : gameStyles.colors.board.cells.default.stroke;
  
  const strokeWidth = isSelected 
    ? responsiveStyles.strokeWidths.thick 
    : responsiveStyles.strokeWidths.normal;
  
  return {
    fill: isSelected ? colors.highlight : colors.fill,
    stroke: strokeColor,
    width: responsiveStyles.layout.cellSize,
    height: responsiveStyles.layout.cellSize,
    strokeWidth,
  };
};

export const createBoardCenterStyle = (
  responsiveStyles: ResponsiveStyles
) => {
  const colors = gameStyles.colors.board.center;
  return {
    fill: colors.fill,
    stroke: colors.stroke,
    strokeWidth: responsiveStyles.strokeWidths.thick,
  };
};

export const createPopupStyle = (
  responsiveStyles: ResponsiveStyles
) => {
  const colors = gameStyles.colors.ui.popup;
  return {
    background: colors.background,
    stroke: colors.stroke,
    strokeWidth: responsiveStyles.strokeWidths.normal,
    borderRadius: responsiveStyles.borderRadius.lg,
    overlay: colors.overlay,
  };
};

export const createModeSwitcherStyle = (
  responsiveStyles: ResponsiveStyles
) => {
  const colors = gameStyles.colors.ui.modeSwitcher;
  return {
    fill: colors.fill,
    stroke: colors.stroke,
    size: responsiveStyles.layout.modeSwitcherSize,
    strokeWidth: responsiveStyles.strokeWidths.normal,
  };
};
