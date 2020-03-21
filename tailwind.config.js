const { fontFamily } = require("tailwindcss/defaultTheme");

module.exports = {
  theme: {
    fontFamily: {
      ...fontFamily,
      sans: ["Noto Sans", "sans-serif"]
    }
  }
};
