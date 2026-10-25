import { useContext } from 'react';
import { ThemeContext } from '@/theme/ThemeProvider';
import type { ThemeContextValue } from '@/theme/ThemeProvider';

const useTheme = (): ThemeContextValue => {
    return useContext(ThemeContext);
};

export { useTheme };
