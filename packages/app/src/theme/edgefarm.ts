import {
  BackstageTheme,
  createTheme,
  darkTheme as backstageDarkTheme,
  lightTheme as backstageLightTheme,
  genPageTheme,
  shapes,
} from '@backstage/theme';

const colors = {
  primary: {
    main: '#ff6116',
  },
  secondary: {
    main: '#4d4d4d',
  },
};

const fontFamily = '"Poppins Light", Helvetica, Arial, Lucida, sans-serif';

const pageTheme = {
  home: genPageTheme({
    colors: [colors.secondary.main, colors.primary.main],
    shape: shapes.wave,
  }),
};

export const darkTheme: BackstageTheme = createTheme({
  palette: {
    ...backstageDarkTheme.palette,
    ...colors,
  },
  fontFamily: fontFamily,
  defaultPageTheme: 'home',
  pageTheme: pageTheme,
});

export const lightTheme: BackstageTheme = createTheme({
  palette: {
    ...backstageLightTheme.palette,
    ...colors,
  },
  fontFamily: fontFamily,
  defaultPageTheme: 'home',
  pageTheme: pageTheme,
});
