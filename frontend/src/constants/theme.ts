/**
 * PezkuwiChain Mobile App - Theme Constants
 */

export const Typography = {
  // Font Sizes
  sizes: {
    tiny: 10,
    small: 12,
    body: 14,
    medium: 16,
    large: 18,
    title: 20,
    heading: 24,
    display: 32,
    hero: 40,
  },

  // Font Weights
  weights: {
    regular: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
  },

  // Line Heights
  lineHeights: {
    tight: 1.2,
    normal: 1.5,
    relaxed: 1.8,
  },
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
};

export const BorderRadius = {
  small: 8,
  medium: 12,
  large: 16,
  xlarge: 20,
  xxlarge: 24,
  round: 9999,
};

export const Shadow = {
  soft: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  medium: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 5,
  },
};

export const IconSizes = {
  tiny: 16,
  small: 20,
  medium: 24,
  large: 32,
  xlarge: 40,
  xxlarge: 60,
};

export default {
  Typography,
  Spacing,
  BorderRadius,
  Shadow,
  IconSizes,
};

