/**
 * Wireframe design tokens: black, white and gray only.
 * Every wireframe component takes its colors from here, so restyling later
 * (real brand colors, dark mode) means editing this one file.
 */
export const WF = {
  black: '#000000',
  white: '#FFFFFF',
  gray900: '#222222',
  gray700: '#555555',
  gray500: '#8A8A8A',
  gray300: '#C8C8C8',
  gray200: '#E0E0E0',
  gray100: '#F2F2F2',
} as const;

export const WFSpace = { xs: 4, sm: 8, md: 16, lg: 24, xl: 32 } as const;
export const WFRadius = { sm: 8, md: 12, lg: 16, pill: 999 } as const;
