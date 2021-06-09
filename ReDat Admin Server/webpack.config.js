const path = require('path');

module.exports = {
    entry: './src/server.js',
    mode: 'development',
    target: 'node',
    output: {
        path: path.resolve(__dirname, '.'),
        filename: 'server.bundle.js'
    }
};