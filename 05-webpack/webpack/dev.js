import webpackMerge from 'webpack-merge';
import commonConfig from './base';

module.exports = function(env) {
  return webpackMerge(commonConfig(), {
    devtool: 'source-map',
    devServer: {
      historyApiFallback: true,
      port: 3000
    }
  })
};
