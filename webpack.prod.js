const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');
const path = require('path');
const Dotenv = require('dotenv-webpack');
module.exports = merge(common, {
    mode: 'production',
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'public'),
        publicPath: '/'
    },
    plugins: [
        new Dotenv({
            safe: true,
            systemvars: true
        })
    ]
});
