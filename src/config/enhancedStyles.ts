// Enhanced styles with better colors and animations
import { gameStyles } from './gameStyles';

export interface AnimationConfig {
  duration: number;
  ease: string;
  delay?: number;
}

export interface EnhancedButtonStyle {
  fill: number;
  stroke: number;
  width: number;
  height: number;
  strokeWidth: number;
  borderRadius: number;
  hover?: {
    scale: number;
    glow: number;
  };
  click?: {
    scale: number;
  };
}

export interface EnhancedTextStyle {
  fontSize: number;
  fill: string;
  fontFamily: string;
  fontWeight: string;
  stroke?: {
    color: string;
    width: number;
  };
  animation?: {
    colorChange?: {
      colors: string[];
      duration: number;
      ease: string;
    };
    pulse?: {
      scale: number;
      duration: number;
      ease: string;
    };
  };
}

// Enhanced button styles with vibrant colors
export const createEnhancedButtonStyle = (
  type: 'primary' | 'secondary' | 'danger' | 'success' = 'primary',
  isDisabled: boolean = false
): EnhancedButtonStyle => {
  if (isDisabled) {
    return {
      fill: 0x666666,
      stroke: 0x999999,
      width: 120,
      height: 40,
      strokeWidth: 2,
      borderRadius: 8,
    };
  }

  const colors: Record<string, number> = {
    primary: 0x4a90e2,    // Bright blue
    secondary: 0x2c3e50,  // Dark blue
    danger: 0xe74c3c,     // Bright red
    success: 0x27ae60,    // Bright green
  };

  return {
    fill: colors[type],
    stroke: 0xffffff,
    width: 120,
    height: 40,
    strokeWidth: 2,
    borderRadius: 8,
    hover: {
      scale: 1.05,
      glow: 0xffffff,
    },
    click: {
      scale: 0.95,
    },
  };
};

// Enhanced text styles with animations
export const createEnhancedTextStyle = (
  size: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl',
  color: string = '#ffffff',
  weight: 'normal' | 'bold' = 'normal',
  animated: boolean = false
): EnhancedTextStyle => {
  const fontSizeMap = {
    xs: 14,
    sm: 16,
    md: 20,
    lg: 24,
    xl: 28,
    xxl: 32,
  };

  const baseStyle: EnhancedTextStyle = {
    fontSize: fontSizeMap[size],
    fill: color,
    fontFamily: 'Arial, sans-serif',
    fontWeight: weight,
    stroke: {
      color: '#000000',
      width: 2,
    },
  };

  if (animated) {
    baseStyle.animation = {
      colorChange: {
        colors: ['#ffffff', '#ffd700', '#ff6b6b', '#4ecdc4', '#45b7d1'],
        duration: 2,
        ease: 'power2.inOut',
      },
      pulse: {
        scale: 1.1,
        duration: 1.5,
        ease: 'power2.inOut',
      },
    };
  }

  return baseStyle;
};

// Animation configurations
export const animationConfigs = {
  buttonHover: {
    duration: 0.3,
    ease: 'power2.out',
  },
  buttonClick: {
    duration: 0.1,
    ease: 'power2.inOut',
  },
  textColorChange: {
    duration: 2,
    ease: 'power2.inOut',
  },
  textPulse: {
    duration: 1.5,
    ease: 'power2.inOut',
  },
  diceRoll: {
    duration: 1,
    ease: 'power2.out',
  },
  balanceChange: {
    duration: 0.8,
    ease: 'back.out(1.7)',
  },
  cellHighlight: {
    duration: 0.5,
    ease: 'power2.out',
  },
  popupShow: {
    duration: 0.4,
    ease: 'back.out(1.7)',
  },
  popupHide: {
    duration: 0.3,
    ease: 'power2.in',
  },
};

// Enhanced cell styles with vibrant colors
export const createEnhancedCellStyle = (
  isBonus: boolean,
  isSelected: boolean
): EnhancedButtonStyle => {
  let fillColor: number;
  let strokeColor: number;
  let strokeWidth: number;

  if (isSelected) {
    fillColor = 0xffff00;  // Bright yellow
    strokeColor = 0xff0000; // Red border
    strokeWidth = 4;
  } else if (isBonus) {
    fillColor = 0xf39c12;  // Bright orange
    strokeColor = 0xe67e22; // Darker orange border
    strokeWidth = 2;
  } else {
    fillColor = 0x8e44ad;  // Bright purple
    strokeColor = 0x9b59b6; // Lighter purple border
    strokeWidth = 2;
  }

  return {
    fill: fillColor,
    stroke: strokeColor,
    width: 60,
    height: 60,
    strokeWidth: strokeWidth,
    borderRadius: 4,
    hover: {
      scale: 1.05,
      glow: 0xffffff,
    },
  };
};

// Enhanced board center style with vibrant colors
export const createEnhancedBoardCenterStyle = (): EnhancedButtonStyle => {
  return {
    fill: 0x1abc9c,  // Bright teal
    stroke: 0x16a085, // Darker teal border
    width: 200,
    height: 200,
    strokeWidth: 4,
    borderRadius: 12,
  };
};