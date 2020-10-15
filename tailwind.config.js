const { fontFamily } = require("tailwindcss/defaultTheme");

module.exports = {
  future: {
    defaultLineHeights: true,
    purgeLayersByDefault: true,
    removeDeprecatedGapUtilities: true,
    standardFontWeights: true,
  },
  purge: ["{components,layouts,pages}/**/*.tsx"],
  theme: {
    fontFamily: {
      ...fontFamily,
      sans: ["Noto Sans", "sans-serif"],
    },
  },
};
