const colors = require("tailwindcss/colors");

module.exports = {
  purge: {
    mode: "all",
    content: ["src/**/*.tsx", "src/**/*.ts"],
  },
  theme: {
    colors: {
      transparent: "transparent",
      current: "currentColor",
      black: colors.black,
      gray: colors.blueGray,
      green: colors.green,
      purple: colors.purple,
      red: colors.red,
      teal: colors.teal,
      white: colors.white,
      yellow: colors.yellow,
    },
    extend: {
      fontFamily: {
        sans: ["Noto Sans", "sans-serif"],
      },
    },
  },
  variants: {
    appearance: [],
  },
};
