module.exports = {
  devIndicators: {
    autoPrerender: false,
  },
  env: {
    CLIENT_ID: process.env.CLIENT_ID,
  },
  webpack: config => {
    config.resolve.alias['~'] = __dirname;

    return config;
  }
};
