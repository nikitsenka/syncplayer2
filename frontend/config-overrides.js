const webpack = require('webpack');

module.exports = function override(config) {
  // Add buffer fallback
  config.resolve.fallback = {
    ...config.resolve.fallback,
    "fs": false,
    "buffer": require.resolve("buffer/"),
    "stream": false,
    "path": false,
    "react-native-fs": false
  };
  
  // Add buffer plugins
  config.plugins = [
    ...config.plugins,
    new webpack.ProvidePlugin({
      Buffer: ['buffer', 'Buffer'],
    })
  ];
  
  return config;
};