declare module '*.jpg';
declare module '*.png';
declare module '*.svg';
declare module '*.css';

import 'styled-components';
import type { NightshiftTheme } from '@/theme/types';

declare module 'styled-components' {
    // eslint-disable-next-line @typescript-eslint/no-empty-interface
    export interface DefaultTheme extends NightshiftTheme {}
}
