import 'styled-components';
import { theme } from './theme';

declare module 'styled-components' {
  export interface DefaultTheme {
    colors: typeof theme.colors;
    shadows: typeof theme.shadows;
    borderRadius: typeof theme.borderRadius;
    fontSizes: typeof theme.fontSizes;
    spacing: typeof theme.spacing;
    zIndex: typeof theme.zIndex;
  }
}
