import React, { createContext, useCallback, useMemo, useState } from 'react';
import { ThemeProvider as SCThemeProvider } from 'styled-components/macro';
import { deepmerge } from 'deepmerge-ts';
import type { DeepPartial } from 'ts-essentials';
import { defaultTheme } from '@/theme/defaults';
import type { NightshiftTheme } from '@/theme/types';

export interface ThemeContextValue {
    theme: NightshiftTheme;
    setTheme: (theme: DeepPartial<NightshiftTheme>) => void;
}

export const ThemeContext = createContext<ThemeContextValue>({
    theme: defaultTheme,
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    setTheme: () => {},
});

interface Props {
    theme?: DeepPartial<NightshiftTheme>;
    children: React.ReactNode;
}

const NightshiftThemeProvider: React.FC<Props> = ({ theme: customTheme, children }) => {
    const [override, setOverride] = useState<DeepPartial<NightshiftTheme> | undefined>(customTheme);

    const merged = useMemo<NightshiftTheme>(() => {
        return deepmerge(defaultTheme, override || {}) as NightshiftTheme;
    }, [override]);

    const setTheme = useCallback((next: DeepPartial<NightshiftTheme>) => {
        setOverride((prev) => deepmerge(prev || {}, next) as DeepPartial<NightshiftTheme>);
    }, []);

    const value = useMemo<ThemeContextValue>(() => ({ theme: merged, setTheme }), [merged, setTheme]);

    return (
        <ThemeContext.Provider value={value}>
            <SCThemeProvider theme={merged}>{children}</SCThemeProvider>
        </ThemeContext.Provider>
    );
};

export { NightshiftThemeProvider };
