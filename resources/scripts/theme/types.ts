export interface ColorScale {
    50: string;
    100: string;
    200: string;
    300: string;
    400: string;
    500: string;
    600: string;
    700: string;
    800: string;
    900: string;
}

export interface ThemeColors {
    black: string;
    white: string;
    primary: ColorScale;
    cyan: ColorScale;
    orange: ColorScale;
    red: ColorScale;
    green: ColorScale;
    yellow: ColorScale;
    gray: ColorScale;
    neutral: ColorScale;
}

export interface ThemeFonts {
    sans: string;
    header: string;
    mono: string;
}

export interface ThemeTransitions {
    duration: {
        75: string;
        100: string;
        150: string;
        200: string;
        250: string;
        300: string;
        500: string;
    };
}

export interface ThemeSpacing {
    0: string;
    1: string;
    2: string;
    3: string;
    4: string;
    5: string;
    6: string;
    8: string;
    10: string;
    12: string;
    16: string;
    20: string;
    24: string;
    32: string;
    40: string;
    48: string;
    56: string;
    64: string;
}

export interface ThemeBorderRadius {
    none: string;
    sm: string;
    DEFAULT: string;
    md: string;
    lg: string;
    xl: string;
    '2xl': string;
    '3xl': string;
    full: string;
}

export interface ThemeShadows {
    sm: string;
    DEFAULT: string;
    md: string;
    lg: string;
    xl: string;
    '2xl': string;
    inner: string;
    none: string;
}

export interface ThemeBreakpoints {
    xs: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
}

export interface NightshiftTheme {
    colors: ThemeColors;
    fonts: ThemeFonts;
    fontSize: Record<string, string>;
    spacing: ThemeSpacing;
    breakpoints: ThemeBreakpoints;
    borderRadius: ThemeBorderRadius;
    shadows: ThemeShadows;
    transitions: ThemeTransitions;
}
