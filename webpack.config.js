const path = require('path');

module.exports = {
  mode: 'production',
  entry: './src/gis.ts',
  output: {
    filename: 'simpleGis.js',
    path: path.resolve(__dirname, 'build'),
    libraryTarget: 'umd'
  },
  module: {
    rules: [{
      test: /\.tsx?$/,
      use: 'ts-loader',
      exclude: /node_modules/
    }]
  },
  resolve: {
    extensions: [ '.tsx', '.ts', '.js' ]
  },
};