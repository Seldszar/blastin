const { fontFamily } = require("tailwindcss/defaultTheme");

module.exports = {
  purge: ["./components/**/*.tsx", "./layouts/**/*.tsx", "./pages/**/*.tsx"],
  theme: {
    fontFamily: {
      ...fontFamily,
      sans: ["Noto Sans", "sans-serif"],
    },
  },
};
