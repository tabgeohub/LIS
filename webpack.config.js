const webpack = require("webpack");

module.exports = function override(config, env) {
  if (!config.resolve) config.resolve = {};
  if (!config.resolve.fallback) config.resolve.fallback = {};

  config.resolve.fallback = {
    ...config.resolve.fallback,
    process: require.resolve("process/browser"), // polyfill for process
  };

  config.plugins = [
    ...(config.plugins || []),
    new webpack.ProvidePlugin({
      process: "process/browser",
    }),
  ];

  return config;
};
