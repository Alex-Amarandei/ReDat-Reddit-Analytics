const path = require('path');

module.exports = {
  entry: './server.js',
  mode: 'development',
  target: 'node',
  output: {
    path: path.resolve(__dirname, '.'),
    filename: 'server.bundle.js'
  }
};