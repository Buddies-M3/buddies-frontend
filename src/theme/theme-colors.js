// =================================================================
// =================================================================
export const grey = {
  900: "#2B3445",
  // Main Text
  800: "#373F50",
  // Paragraph
  700: "#4B566B",
  600: "#7D879C",
  // Low Priority form Title/Text
  500: "#AEB4BE",
  400: "#DAE1E7",
  // Border
  300: "#E3E9EF",
  200: "#F3F5F9",
  // Line Stroke
  100: "#F6F9FC"
};
/* export const primary = {
  100: "#FCE9EC",
  200: "#F8C7CF",
  300: "#F07D90",
  400: "#EC6178",
  500: "#D23F57",
  600: "#E63E58",
  700: "#E3364E",
  800: "#DF2E44",
  900: "#D91F33"
}; */

export const primary = {
  100: "#E7F4E1",  // Lighter shade of #6CBA4D
  200: "#CDE8BC",  // Light shade
  300: "#B4DD97",  // Mid-light shade
  400: "#9AD172",  // Slightly lighter than base
  500: "#6CBA4D",  // NCTR Green - Base Color
  600: "#5A9E3F",  // Slightly darker than base
  700: "#478231",  // Dark shade
  800: "#356623",  // Darker shade
  900: "#234A15"   // Darkest shade
};

export const secondary = {
  100: "#E8F3FF",  // Lighter shade of #66AADF
  200: "#D1E7FF",  // Light shade
  300: "#A3CFFF",  // Mid-light shade
  400: "#84BCEF",  // Slightly lighter than base
  500: "#66AADF",  // NCTR Blue - Base Color
  600: "#4D8BC7",  // Slightly darker than base
  700: "#356CAF",  // Dark shade
  800: "#1C4D97",  // Darker shade
  900: "#0A2E7F",  // Darkest shade
  main: "#66AADF",
  dark: "#35579F"
};
export const error = {
  100: "#FFEAEA",
  200: "#FFCBCB",
  300: "#FFA9A9",
  400: "#FF6D6D",
  500: "#FF5353",
  600: "#FF4C4C",
  700: "#FF4242",
  800: "#FF3939",
  900: "#FF2929",
  main: "#E94560"
};
export const success = {
  100: "#E7F9ED",
  200: "#C2F1D1",
  300: "#99E8B3",
  400: "#52D77E",
  500: "#33D067",
  600: "#2ECB5F",
  700: "#27C454",
  800: "#20BE4A",
  900: "#0b7724",
  main: "rgb(51, 208, 103)"
};
export const blue = {
  50: "#f3f5f9",
  100: "#E8F3FF",
  200: "#D1E7FF",
  300: "#A3CFFF",
  400: "#84BCEF",
  500: "#66AADF",  // NCTR Blue
  600: "#35579F",  // NCTR Dark Blue
  700: "#2A4580",
  800: "#1F3461",
  900: "#142242",
  main: "#66AADF",
  contrastText: "#FFFFFF"
};
export const marron = {
  50: "#f3f5f9",
  100: "#F6F2ED",
  200: "#F8DBD1",
  300: "#EBBCB3",
  400: "#D89C98",
  600: "#A3545C",
  700: "#883948",
  800: "#6E2438",
  900: "#5B162F",
  main: "#BE7374"
};
export const paste = {
  50: "#F5F5F5",
  100: "#DDFBF1",
  200: "#BDF7E8",
  300: "#97E8DA",
  400: "#76D2CA",
  600: "#36929A",
  700: "#257181",
  800: "#175368",
  900: "#0E3D56",
  main: "#4BB4B4",
  contrastText: "#FFFFFF"
};
export const warning = {
  100: "#FFF8E5",
  main: "#FFCD4E",
  contrastText: "#FFFFFF"
};
export const dark = {
  main: "#222"
};
export const white = {
  main: "#fff"
};
export const themeColors = {
  dark,
  grey,
  paste,
  error,
  marron,
  warning,
  success,
  secondary,
  info: blue,
  divider: grey[200],
  background: {
    default: grey[100]
  },
  text: {
    primary: grey[900],
    secondary: grey[800],
    disabled: grey[400]
  }
};