const path = require("path");
const webpack = require("webpack");

module.exports = {
  webpack: {
    configure: (webpackConfig, { env, paths }) => {
      // Add fallback for timers
      webpackConfig.resolve.fallback = {
        ...webpackConfig.resolve.fallback,
        timers: require.resolve("timers-browserify"),
      };

      // Add aliases
      webpackConfig.resolve.alias = {
        ...webpackConfig.resolve.alias,
        "@helpers": path.resolve(__dirname, "src/helpers/"),
        "@components": path.resolve(__dirname, "src/components/"),
        "@types": path.resolve(__dirname, "src/types/"),
        // Add other aliases as needed
      };

      // Fix for date-fns .cjs imports - redirect to directory structure
      // Replace .cjs imports from date-fns with directory imports
      // e.g., date-fns/addDays.cjs -> date-fns/addDays
      webpackConfig.plugins = [
        ...(webpackConfig.plugins || []),
        new webpack.NormalModuleReplacementPlugin(
          /^date-fns\/(.+?)\.cjs$/,
          (resource) => {
            const functionName = resource.request.match(
              /date-fns\/(.+?)\.cjs$/
            )[1];
            resource.request = `date-fns/${functionName}`;
          }
        ),
      ];

      return webpackConfig;
    },
  },

  devServer: (devServerConfig, { env, paths, proxy, allowedHost }) => {
    // Fix for webpack-dev-server deprecation warnings
    devServerConfig.setupMiddlewares = (middlewares, devServer) => {
      // You can add custom middlewares here if needed
      return middlewares;
    };

    // Remove deprecated options if present (for safety)
    delete devServerConfig.onBeforeSetupMiddleware;
    delete devServerConfig.onAfterSetupMiddleware;

    return devServerConfig;
  },
};
