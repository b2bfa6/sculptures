const path = require('path')

function resolve(dir) {
    return path.join(__dirname, dir)
}


module.exports = {
    configureWebpack: {
        resolve: {
            alias: {
                '@': resolve('src')
            }
        },
        devServer: {
            historyApiFallback: true
        },
    },

    publicPath: process.env.NODE_ENV === 'production'
        ? '/'
        : '/'
}
