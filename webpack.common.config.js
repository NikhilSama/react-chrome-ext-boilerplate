const path = require('path');
const copyPlugin = require('copy-webpack-plugin');//Dont use; not compatible w current node version
const htmlPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
    mode: 'development',
    devtool: 'cheap-module-source-map',
    entry: {
        popup: path.resolve('src/popup/popup.tsx'), 
        options: path.resolve('src/options/options.tsx'), 
        background: path.resolve('src/background/background.ts'), 
        contentScript: path.resolve('src/content/contentScript.ts')
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader'], 
                exclude: /node_modules/
            }, 
            {
                type: 'asset/resource',
                test: /\.(png|svg|jpg|jpeg|gif|woff|woff2|eot|ttf)$/i,
            }
        ],
    },
    plugins: [
        new CleanWebpackPlugin({
            cleanStaleWebpackAssets: false
        }),
        new copyPlugin({
            patterns: [
                { 
                    from: path.resolve('src/static'), 
                    to: path.resolve('dist')
                }
            ]
        }),
        ...getHtmlPlugins(['popup', 'options'])
    ],
    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
    },
    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, 'dist'),
    }, 
    optimization: {
        splitChunks: {
            chunks: 'all'
        }
    }

}

function getHtmlPlugins(chunks){
    return chunks.map(chunk => new htmlPlugin({
        title: 'React App',
        filename: `${chunk}.html`,
        chunks: [chunk]
    }));
}