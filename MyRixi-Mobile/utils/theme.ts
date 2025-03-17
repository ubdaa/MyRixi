export type ColorMode = 'dark' | 'light';

export interface ThemeColors {
  // Couleurs de fond
  background1: string;
  background2: string;
  
  // Couleurs de texte
  textPrimary: string;
  textSecondary: string;
  
  // Contours et séparateurs
  divider: string;
  
  // Couleurs d'accent
  cyberPink: string;
  neoPurple: string;
  technoBlue: string;
  synthGreen: string;
  solarGold: string;
  holoTurquoise: string;
}

export interface ThemeShadows {
  glassShadow: string;
  neoShadow: string;
  neoInsetShadow: string;
}

export interface Theme {
  colors: ThemeColors;
  shadows: ThemeShadows;
  roundness: number;
  glassmorphism: {
    opacity: number;
    blur: number;
  };
}

const darkColors: ThemeColors = {
  background1: '#141316',
  background2: '#1A1B1F',
  textPrimary: '#F2F2F2',
  textSecondary: '#B8B8B8',
  divider: '#2A2A2E',
  
  // Couleurs d'accent
  cyberPink: '#FF4F9A',
  neoPurple: '#8A2EFF',
  technoBlue: '#18A0FB',
  synthGreen: '#00D67D',
  solarGold: '#FBC02D',
  holoTurquoise: '#42FFD6',
};

const lightColors: ThemeColors = {
  background1: '#F8F8FA',
  background2: '#FFFFFF',
  textPrimary: '#202020',
  textSecondary: '#606060',
  divider: '#E2E2E2',
  
  // Couleurs d'accent (identiques en mode clair)
  cyberPink: '#FF4F9A',
  neoPurple: '#8A2EFF',
  technoBlue: '#18A0FB',
  synthGreen: '#00D67D',
  solarGold: '#FBC02D',
  holoTurquoise: '#42FFD6',
};

export const darkTheme: Theme = {
  colors: darkColors,
  shadows: {
    glassShadow: '0px 4px 24px rgba(0, 0, 0, 0.25)',
    neoShadow: '4px 4px 8px rgba(0, 0, 0, 0.3), -4px -4px 8px rgba(255, 255, 255, 0.05)',
    neoInsetShadow: 'inset 2px 2px 4px rgba(0, 0, 0, 0.4), inset -2px -2px 4px rgba(255, 255, 255, 0.05)',
  },
  roundness: 16,
  glassmorphism: {
    opacity: 0.15,
    blur: 15,
  },
};

export const lightTheme: Theme = {
  colors: lightColors,
  shadows: {
    glassShadow: '0px 4px 24px rgba(0, 0, 0, 0.08)',
    neoShadow: '4px 4px 8px rgba(0, 0, 0, 0.08), -4px -4px 8px rgba(255, 255, 255, 0.6)',
    neoInsetShadow: 'inset 2px 2px 4px rgba(0, 0, 0, 0.08), inset -2px -2px 4px rgba(255, 255, 255, 0.6)',
  },
  roundness: 16,
  glassmorphism: {
    opacity: 0.7,
    blur: 15,
  },
};

export function getTheme(colorMode: ColorMode): Theme {
  return colorMode === 'dark' ? darkTheme : lightTheme;
}