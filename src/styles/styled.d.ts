import 'styled-components';

declare module 'styled-components' {
  export interface DefaultTheme {
    colors: {
      primary: string;
      secondary: string;
      accent: string;
      background: string;
      surface: string;
      text: string;
      textLight: string;
      border: string;
      success: string;
      error: string;
      warning: string;
      info: string;
    };
    gradients: {
      primary: string;
      secondary: string;
      accent: string;
    };
    shadows: {
      small: string;
      medium: string;
      large: string;
      xlarge: string;
    };
    borderRadius: {
      small: string;
      medium: string;
      large: string;
      xlarge: string;
    };
    spacing: {
      xs: string;
      sm: string;
      md: string;
      lg: string;
      xl: string;
      xxl: string;
    };
    breakpoints: {
      mobile: string;
      tablet: string;
      desktop: string;
    };
    transitions: {
      fast: string;
      normal: string;
      slow: string;
    };
  }
}