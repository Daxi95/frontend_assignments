import path from 'path'
import ExtractTextPlugin from 'extract-text-webpack-plugin'
import CopyWebpackPlugin from 'copy-webpack-plugin';

const DIST_DIR = path.resolve(__dirname, 'dist');
const SRC_DIR = path.resolve(__dirname, 'src');

const extractSass = new ExtractTextPlugin({
  filename: "css/main.css",
  disable: process.env.NODE_ENV === "development"
});

const copyFiles = new CopyWebpackPlugin([
  { from: SRC_DIR + '/index.html', to: DIST_DIR + '/index.html' }
]);

const config = {
  entry: SRC_DIR + '/app.js',
  output: {
    filename: 'app.js',
    path: DIST_DIR
  },
  //devtool: 'source-map',
  watch: true,
  module: {
    rules: [
      {
        test: /\.js$/,
        include: SRC_DIR,
        loader: 'babel-loader',
        options: {
          presets: [
            ['es2015', { modules: false }]
          ]
        }
      },
      {
        test: /\.hbs$/,
        exclude: /node_modules/,
        loader: "handlebars-loader",
        query: {
          partialDirs: [
            path.join(SRC_DIR, 'templates', 'partials')
          ]
        }
      },
      {
        test: /\.scss$/,
        include: SRC_DIR,
        use: extractSass.extract({
          fallback: 'style-loader',
          use: ['css-loader','sass-loader']
        })
      }
    ]
  },
  plugins: [
    extractSass,
    copyFiles
  ]
};

module.exports = config;
