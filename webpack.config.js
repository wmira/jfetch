var webpack = require('webpack');

var plugins = [
];

if (process.env.COMPRESS) {

    plugins.push(
        new webpack.optimize.UglifyJsPlugin({
            compressor: {
                warnings: false
            }
        })
    );
}

module.exports = {
    node: {
        buffer: false
    },
    output: {
        library: 'jfetch',
        libraryTarget: 'umd'
    },

    plugins: plugins,

    module: {
        loaders: [
            {test: /\.js$/,
                exclude: /node_modules/,
                loader: 'babel',
                query: {
                    presets: ['es2015']
                }
            }
        ]
    }
};
