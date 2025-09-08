// Centralized style and color configuration for the Monopoly game

export interface ColorPalette {
  // Background colors
  background: {
    primary: number;
    secondary: number;
    overlay: number;
  };
  
  // Board colors
  board: {
    center: {
      fill: number;
      stroke: number;
    };
    cells: {
      bonus: {
        fill: number;
        highlight: number;
      };
      regular: {
        fill: number;
        highlight: number;
      };
      selected: {
        stroke: number;
      };
      default: {
        stroke: number;
      };
    };
  };
  
  // UI colors
  ui: {
    buttons: {
      primary: {
        fill: number;
        stroke: number;
        disabled: {
          fill: number;
          stroke: number;
        };
      };
      secondary: {
        fill: number;
        stroke: number;
      };
      danger: {
        fill: number;
        stroke: number;
      };
      success: {
        fill: number;
        stroke: number;
      };
    };
    
    text: {
      primary: string;
      secondary: string;
      success: string;
      warning: string;
      error: string;
      disabled: string;
    };
    
    popup: {
      background: number;
      stroke: number;
      overlay: number;
    };
    
    modeSwitcher: {
      fill: number;
      stroke: number;
    };
  };
  
  // Game state colors
  game: {
    balance: {
      positive: string;
      negative: string;
    };
    mode: {
      mock: string;
      live: string;
    };
  };
}

export interface Typography {
  fontFamily: string;
  sizes: {
    xs: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
    xxl: number;
  };
  weights: {
    normal: string;
    bold: string;
  };
}

export interface Spacing {
  xs: number;
  sm: number;
  md: number;
  lg: number;
  xl: number;
  xxl: number;
}

export interface BorderRadius {
  sm: number;
  md: number;
  lg: number;
}

export interface GameStyles {
  colors: ColorPalette;
  typography: Typography;
  spacing: Spacing;
  borderRadius: BorderRadius;
  strokeWidths: {
    thin: number;
    normal: number;
    thick: number;
  };
}

// Default color palette - easily customizable
const defaultColors: ColorPalette = {
  background: {
    primary: 0x922724,    // Main background (red-brown)
    secondary: 0x1abc9c,  // Board center
    overlay: 0x000000,    // Modal overlays
  },
  
  board: {
    center: {
      fill: 0x1abc9c,     // Teal center
      stroke: 0x16a085,   // Darker teal border
    },
    cells: {
      bonus: {
        fill: 0xf39c12,   // Orange bonus cells
        highlight: 0xffc04d, // Light orange highlight
      },
      regular: {
        fill: 0x8e44ad,   // Purple regular cells
        highlight: 0xa569bd, // Light purple highlight
      },
      selected: {
        stroke: 0xffff00, // Yellow selection
      },
      default: {
        stroke: 0x34495e, // Dark gray default
      },
    },
  },
  
  ui: {
    buttons: {
      primary: {
        fill: 0x4a90e2,   // Blue primary button
        stroke: 0xffffff, // White border
        disabled: {
          fill: 0x666666, // Gray disabled
          stroke: 0x999999, // Light gray border
        },
      },
      secondary: {
        fill: 0x2c3e50,   // Dark blue secondary
        stroke: 0xecf0f1, // Light gray border
      },
      danger: {
        fill: 0xe74c3c,   // Red danger button
        stroke: 0xffffff, // White border
      },
      success: {
        fill: 0x27ae60,   // Green success button
        stroke: 0xffffff, // White border
      },
    },
    
    text: {
      primary: '#ffffff',   // White primary text
      secondary: '#ecf0f1', // Light gray secondary
      success: '#00e676',   // Green success
      warning: '#ffcc00',   // Yellow warning
      error: '#ff6b6b',     // Red error
      disabled: '#cccccc',  // Gray disabled
    },
    
    popup: {
      background: 0x34495e, // Dark blue popup
      stroke: 0xffffff,     // White border
      overlay: 0x000000,    // Black overlay
    },
    
    modeSwitcher: {
      fill: 0x2c3e50,      // Dark blue
      stroke: 0xecf0f1,    // Light gray
    },
  },
  
  game: {
    balance: {
      positive: '#00e676', // Green for gains
      negative: '#ff6b6b', // Red for losses
    },
    mode: {
      mock: '#00ff00',     // Green for mock mode
      live: '#ff6b6b',     // Red for live mode
    },
  },
};

// Typography configuration
const typography: Typography = {
  fontFamily: 'Arial, sans-serif',
  sizes: {
    xs: 10,
    sm: 12,
    md: 14,
    lg: 16,
    xl: 18,
    xxl: 20,
  },
  weights: {
    normal: 'normal',
    bold: 'bold',
  },
};

// Spacing configuration
const spacing: Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
};

// Border radius configuration
const borderRadius: BorderRadius = {
  sm: 4,
  md: 8,
  lg: 12,
};

// Stroke widths
const strokeWidths = {
  thin: 1,
  normal: 2,
  thick: 4,
};

// Main game styles configuration
export const gameStyles: GameStyles = {
  colors: defaultColors,
  typography,
  spacing,
  borderRadius,
  strokeWidths,
};

// Theme variants - easy to switch between different color schemes
export const themes = {
  default: gameStyles,
  
  // Dark theme variant
  dark: {
    ...gameStyles,
    colors: {
      ...defaultColors,
      background: {
        primary: 0x1a1a1a,
        secondary: 0x2d2d2d,
        overlay: 0x000000,
      },
      ui: {
        ...defaultColors.ui,
        text: {
          primary: '#ffffff',
          secondary: '#cccccc',
          success: '#4caf50',
          warning: '#ff9800',
          error: '#f44336',
          disabled: '#666666',
        },
      },
    },
  },
  
  // Light theme variant
  light: {
    ...gameStyles,
    colors: {
      ...defaultColors,
      background: {
        primary: 0xf5f5f5,
        secondary: 0xe0e0e0,
        overlay: 0x000000,
      },
      ui: {
        ...defaultColors.ui,
        text: {
          primary: '#333333',
          secondary: '#666666',
          success: '#4caf50',
          warning: '#ff9800',
          error: '#f44336',
          disabled: '#999999',
        },
      },
    },
  },
  
  // Monopoly classic theme
  classic: {
    ...gameStyles,
    colors: {
      ...defaultColors,
      background: {
        primary: 0x8b4513,  // Saddle brown
        secondary: 0x228b22, // Forest green
        overlay: 0x000000,
      },
      board: {
        center: {
          fill: 0x228b22,   // Forest green
          stroke: 0x006400, // Dark green
        },
        cells: {
          bonus: {
            fill: 0xffd700, // Gold
            highlight: 0xffed4e,
          },
          regular: {
            fill: 0x4169e1, // Royal blue
            highlight: 0x6495ed,
          },
          selected: {
            stroke: 0xff0000, // Red selection
          },
          default: {
            stroke: 0x000000, // Black default
          },
        },
      },
    },
  },
};

// Helper functions for easy access
export const getColor = (path: string): number | string => {
  const keys = path.split('.');
  let value: any = gameStyles.colors;
  
  for (const key of keys) {
    value = value[key];
    if (value === undefined) {
      console.warn(`Color path "${path}" not found`);
      return 0x000000; // Fallback to black
    }
  }
  
  return value;
};

export const getTextColor = (path: string): string => {
  const keys = path.split('.');
  let value: any = gameStyles.colors.ui.text;
  
  for (const key of keys) {
    value = value[key];
    if (value === undefined) {
      console.warn(`Text color path "${path}" not found`);
      return '#ffffff'; // Fallback to white
    }
  }
  
  return value;
};

export const getFontSize = (size: keyof Typography['sizes']): number => {
  return gameStyles.typography.sizes[size];
};

export const getSpacing = (size: keyof Spacing): number => {
  return gameStyles.spacing[size];
};

export const getStrokeWidth = (width: keyof typeof strokeWidths): number => {
  return gameStyles.strokeWidths[width];
};

// Theme switching function
export const setTheme = (themeName: keyof typeof themes) => {
  const theme = themes[themeName];
  if (theme) {
    Object.assign(gameStyles, theme);
    console.log(`Theme switched to: ${themeName}`);
  } else {
    console.warn(`Theme "${themeName}" not found`);
  }
};
